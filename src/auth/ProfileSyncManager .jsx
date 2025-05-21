import React, { useEffect, useState } from 'react';
import { useAuth } from './UseAuth';
import { supabase } from '../SupaClient';

/**
 * Komponen utilitas untuk memastikan profil pengguna selaras dengan auth
 * Gunakan komponen ini di App.js atau layout utama
 */
const ProfileSyncManager = () => {
  const { user, loading, fetchUser } = useAuth();
  const [syncAttempted, setSyncAttempted] = useState(false);

  useEffect(() => {
    // Fungsi untuk coba sinkronisasi profil
    const syncProfile = async () => {
      if (!user || syncAttempted) return;
      
      try {
        console.log("Attempting profile sync for user:", user.id);
        
        // Cek apakah profil sudah ada
        const { data: profileExists, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking profile:", checkError);
        }
        
        // Jika profil tidak ditemukan, buat profil baru
        if (!profileExists) {
          console.log("Profile not found for authenticated user, creating...");
          
          // Ekstrak metadata yang tersedia dari user auth
          const fullName = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           "";
                           
          const username = user.user_metadata?.preferred_username || 
                          user.user_metadata?.name || 
                          user.email?.split("@")[0] || 
                          "";
                          
          // Coba buat profil melalui RPC (lebih aman)
          const { data: created, error: createError } = await supabase.rpc(
            'create_profile_for_user',
            {
              user_id: user.id,
              user_email: user.email,
              user_full_name: fullName,
              user_username: username,
              user_avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || ""
            }
          );
          
          if (createError) {
            console.error("Error creating profile via RPC:", createError);
            
            // Fallback: coba insert langsung
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                username: username,
                full_name: fullName,
                avatar_url: user.user_metadata?.avatar_url || ""
              });
              
            if (insertError) {
              console.error("Direct insert also failed:", insertError);
            } else {
              console.log("Profile created via direct insert");
              // Refresh data user
              fetchUser();
            }
          } else {
            console.log("Profile created via RPC");
            // Refresh data user
            fetchUser();
          }
        } else {
          console.log("Profile already exists, no action needed");
        }
      } catch (err) {
        console.error("Profile sync error:", err);
      } finally {
        setSyncAttempted(true);
      }
    };
    
    // Tunggu hingga loading selesai sebelum memeriksa profil
    if (!loading && user && !syncAttempted) {
      syncProfile();
    }
  }, [user, loading, fetchUser, syncAttempted]);

  // Komponen ini tidak merender apapun
  return null;
};

export default ProfileSyncManager;