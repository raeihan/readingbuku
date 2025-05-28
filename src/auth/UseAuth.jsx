import { create } from "zustand";
import { supabase } from "../SupaClient";

export const useAuth = create((set, get) => ({
  user: null,
  id: "",
  auth: false,
  full_name: "",
  username: "",
  avatar_url: "",
  email: "",
  loading: true,

  // Fungsi untuk login dengan Google
  loginWithGoogle: async () => {
    try {
      // Set loading state
      set({ loading: true });

      // Check if provider is enabled first
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          scopes: "email profile",
        },
      });

      if (error) {
        console.error("Google login error:", error.message);
        set({ loading: false });
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Login with Google failed:", error.message);
      set({ loading: false });

      // Return specific error message for better user feedback
      if (error.message.includes("provider is not enabled")) {
        throw new Error(
          "Provider Google belum diaktifkan di project Supabase. Silakan cek konfigurasi Supabase Anda."
        );
      } else {
        throw error;
      }
    }
  },

  register: async (full_name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error: ", error.message);
    } else {
      try {
        const { error: profileRegister } = await supabase
          .from("profiles")
          .upsert([{ id: data.user.id, full_name, email }]);
        if (profileRegister) {
          console.error("Update Error: ", profileRegister.message);
        } else {
          set({
            user: data.user,
            auth: true,
            full_name,
            email,
            loading: false,
          });
        }
      } catch (error) {
        console.error("User Can't be Added:", error.message);
      }
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login Failed: ", error.message);
    } else {
      set({ user: data.user, auth: true });
      await get().fetchUserData(data.user.id);
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error.message);
      return;
    }
    set({
      user: null,
      auth: false,
      full_name: "",
      username: "",
      avatar_url: "",
      email: "",
    });
    // Pastikan localStorage juga dibersihkan
    localStorage.removeItem("sb-ggigrakpmocwmzfyrzdi-auth-token");
  },

  // Fungsi ini untuk mengecek status autentikasi dan mengambil data pengguna saat aplikasi dimuat
  checkAuthAndGetSession: async () => {
    try {
      set({ loading: true });

      // Ambil sesi pengguna saat ini
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
        set({ loading: false });
        return null;
      }

      // Jika tidak ada sesi yang aktif
      if (!session) {
        set({ loading: false });
        return null;
      }

      // Jika ada sesi, ambil data user dari session
      const { user } = session;

      set({
        user,
        auth: true,
        id: user.id,
        email: user.email,
      });

      // Ambil data profil dari tabel profiles
      await get().fetchUserData(user.id);

      // FIX: Tambahkan pemeriksaan apakah perlu membuat profil baru
      await get().createProfileIfNotExists(user);

      return user;
    } catch (error) {
      console.error("Check auth error:", error.message);
      set({ loading: false });
      return null;
    }
  },

  // BARU: Fungsi khusus untuk memastikan profil user dibuat
  createProfileIfNotExists: async (user) => {
    if (!user) return;

    try {
      // Cek apakah profil sudah ada dengan error handling yang lebih baik
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // Gunakan maybeSingle() instead of single()

      if (profileError) {
        console.error("Error checking profile:", profileError.message);
        // Jika error bukan karena tidak ada data, return
        if (profileError.code !== "PGRST116") {
          return;
        }
      }

      // Jika profil belum ada, buat profil baru
      if (!existingProfile) {
        // Extract metadata dengan lebih teliti
        const fullName =
          user.user_metadata?.full_name || user.user_metadata?.name || "";

        const username =
          user.user_metadata?.preferred_username ||
          user.user_metadata?.nickname ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "";

        const avatarUrl =
          user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

        let profileData = {
          id: user.id,
          email: user.email,
          full_name: fullName,
          username: username,
          avatar_url: avatarUrl,
        };
        // Metode 1: Gunakan RPC function yang lebih aman
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc(
            "create_profile_for_user",
            {
              user_id: user.id,
              user_email: user.email,
              user_full_name: profileData.full_name,
              user_username: profileData.username,
              user_avatar_url: profileData.avatar_url,
            }
          );

          if (rpcError) {
            console.warn("RPC create profile failed:", rpcError.message);
            throw rpcError;
          }
          set({
            full_name: profileData.full_name,
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            loading: false,
          });
          return;
        } catch (rpcError) {
          // Metode 2: Insert langsung dengan upsert
          try {
            const { data: insertedProfile, error: insertError } = await supabase
              .from("profiles")
              .upsert(profileData, {
                onConflict: "id",
                ignoreDuplicates: false,
              })
              .select()
              .single();

            if (insertError) {
              console.error("Direct insert error:", insertError.message);

              // Metode 3: Coba dengan minimum data jika masih gagal
              const minimalData = {
                id: user.id,
                email: user.email,
              };

              const { data: minimalProfile, error: minError } = await supabase
                .from("profiles")
                .upsert(minimalData, {
                  onConflict: "id",
                  ignoreDuplicates: false,
                })
                .select()
                .single();

              if (minError) {
                console.error(
                  "Even minimal profile creation failed:",
                  minError.message
                );
                // Jika semua metode gagal, set state dengan data user metadata saja
                set({
                  full_name: profileData.full_name,
                  username: profileData.username,
                  avatar_url: profileData.avatar_url,
                  loading: false,
                });
                return;
              }
              set({
                full_name: "",
                username: user.email.split("@")[0] || "",
                avatar_url: "",
                loading: false,
              });
              return;
            }
            set({
              full_name: insertedProfile.full_name || "",
              username: insertedProfile.username || profileData.username,
              avatar_url: insertedProfile.avatar_url || "",
              loading: false,
            });
          } catch (insertError) {
            console.error("All profile creation methods failed:", insertError);
            // Set state with user metadata as fallback
            set({
              full_name: profileData.full_name,
              username: profileData.username,
              avatar_url: profileData.avatar_url,
              loading: false,
            });
          }
        }
      } else {
        set({
          full_name: existingProfile.full_name || "",
          username: existingProfile.username || user.email.split("@")[0] || "",
          avatar_url: existingProfile.avatar_url || "",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error in createProfileIfNotExists:", error.message);
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    try {
      if (!get().user) {
        set({ loading: true });

        // Cek session dari Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Fetch session error:", error.message);
          set({ loading: false });
          return;
        }

        if (!session) {
          set({ loading: false });
          return;
        }

        // Jika ada sesi, ambil data user dari session
        const { user } = session;

        if (user) {
          set({
            user,
            auth: true,
            id: user.id,
            email: user.email,
          });

          // Fetch additional data from profiles table
          await get().fetchUserData(user.id);

          // FIX: Ensure profile exists (buat profil jika belum ada)
          await get().createProfileIfNotExists(user);
        } else {
        }
      } else {
        await get().fetchUserData(get().user.id);

        // FIX: Ensure profile exists even if user is already in state
        await get().createProfileIfNotExists(get().user);
      }
    } catch (error) {
      console.error("Unexpected error in fetchUser:", error.message);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserData: async (userId) => {
    try {
      const { data: userData, error } = await supabase
        .from("profiles")
        .select("full_name, email, username, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Fetch user data error: ", error.message);
        if (error.code === "PGRST116") {
          // FIX: Ensure profile is created if user data isn't found
          if (get().user) {
            await get().createProfileIfNotExists(get().user);
          }
        }
        return;
      }

      if (userData) {
        set({
          id: userId,
          full_name: userData.full_name || "",
          email: userData.email || get().email,
          username: userData.username || "",
          avatar_url: userData.avatar_url || "",
        });
      } else {
        // FIX: Ensure profile is created if user data isn't found
        if (get().user) {
          await get().createProfileIfNotExists(get().user);
        }
      }
    } catch (error) {
      console.error("Unexpected error in fetchUserData:", error.message);
    }
  },

  updateProfile: async (userId, full_name, email, username, avatar_url) => {
    try {
      if (!userId) {
        console.error("User ID is required for update");
        return false;
      }

      // Cek session terlebih dahulu
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("No valid session for update");
        return false;
      }

      // Cek apakah record user ada di tabel profiles
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing profile:", checkError);
        return false;
      }

      // Data untuk update/insert
      const updateData = {
        full_name,
        email,
        username,
        avatar_url,
      };

      // Jika profile tidak ada, buat terlebih dahulu menggunakan upsert
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            ...updateData,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single();

      if (upsertError) {
        console.error("Upsert Error Details:", {
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code,
        });
        return false;
      }
      set({ full_name, email, username, avatar_url });
      return true;
    } catch (error) {
      console.error("Unexpected error in updateProfile:", error);
      return false;
    }
  },
}));
