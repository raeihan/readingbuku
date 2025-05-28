import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "../home/Header";
import { useAuth } from "../auth/UseAuth";
import { Helmet } from "react-helmet";
import { supabase } from "../SupaClient";

const ProfilePages = () => {
  const {
    full_name,
    email,
    username,
    avatar_url,
    logout,
    fetchUser,
    loading,
    user,
    checkAuthAndGetSession,
  } = useAuth();
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Cek autentikasi dan ambil data pengguna saat komponen dimuat
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isInitialized.current) return;
        isInitialized.current = true;

        // Cek status autentikasi dan ambil session
        const userData = await checkAuthAndGetSession();

        if (!userData) {
          navigate("/login");
          return;
        }

        // Jika tidak ada data profil lengkap padahal user sudah terautentikasi
        if (userData && (!full_name || !username)) {
          await fetchUser();
        }
      } catch (error) {
        console.error("Error initializing profile page:", error);
        navigate("/login");
      }
    };

    initializeAuth();
  }, [navigate, checkAuthAndGetSession, fetchUser, full_name, username]);

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logout Success");
      navigate("/");
    } catch (error) {
      alert("Logout Failed");
      console.error("Logout Error:", error);
    }
  };

  const handleEdit = () => {
    navigate("/updateprofile");
  };

  // Function to get avatar URL from Supabase storage - PERBAIKAN DI SINI
  const getAvatarUrl = () => {
    if (!avatar_url) return null;

    // Check if avatar_url is already a full URL (starts with http or https)
    if (avatar_url.startsWith("http://") || avatar_url.startsWith("https://")) {
      return avatar_url;
    }

    // If avatar_url is a storage path, generate a public URL
    try {
      // Perbaikan: menggunakan property data.publicUrl yang sesuai dengan API terbaru
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(avatar_url);
      
      return data?.publicUrl || null;
    } catch (error) {
      console.error("Error getting avatar URL:", error);
      return null;
    }
  };

  // Tampilkan loading state ketika sedang memuat
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading Profile...
        </p>
      </div>
    );
  }

  // Arahkan ke login jika tidak ada user terautentikasi
  if (!user) {
    // Redirect dilakukan di useEffect untuk menghindari error selama render
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Redirecting to login...
        </p>
      </div>
    );
  }

  // Get the proper avatar URL
  const avatarPublicUrl = getAvatarUrl();

  return (
    <>
      <Helmet>
        <title>{full_name || "Profile"} Pages</title>
        <meta name="description" content="Profile page" />
        <meta name="keywords" content="ReadingBuku" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <Header />
      <div className="p-7">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-colorback rounded-lg transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="min-h-screen bg-gradient-to-br bg-colorback dark:bg-zinc-800 flex flex-col items-center py-12 px-4 sm:px-8 lg:px-16 max-md:mt-10"
        >
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-zinc-700 shadow-lg rounded-2xl max-w-lg sm:max-w-3xl w-full p-6 sm:p-8 lg:p-12 text-center sm:text-left relative"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <div className="flex flex-col items-center sm:items-start space-y-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gray-300 overflow-hidden shadow-md border-4 border-yellow-500">
                {avatarPublicUrl ? (
                  <img
                    src={avatarPublicUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading avatar image");
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Avatar";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                    <span className="text-4xl font-bold">
                      {(full_name || email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {full_name || "User"}
              </h1>
              <p className="text-md sm:text-lg lg:text-xl text-gray-600 dark:text-white">
                {username || email?.split("@")[0] || "user"}
              </p>
              <p className="text-gray-500 text-sm sm:text-base dark:text-white">
                {email || "No Email"}
              </p>

              {(!full_name || !username) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 dark:bg-yellow-900 dark:border-yellow-600">
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Profil belum lengkap. Klik tombol Edit untuk melengkapi
                    profil Anda.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-md transition duration-300"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePages;