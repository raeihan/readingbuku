import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useAuth } from "../auth/UseAuth";

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const { loginWithGoogle, checkAuthAndGetSession } = useAuth();
  const navigate = useNavigate();

  // Simulasi waktu loading dengan durasi singkat
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Cek status autentikasi saat komponen dimuat
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ambil session pengguna dari custom hook
        const user = await checkAuthAndGetSession();
        
        // Jika ada user, redirect ke halaman utama
        if (user) {
          console.log("User already logged in, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, checkAuthAndGetSession]);

  // Handle autentikasi redirect setelah kembali dari OAuth provider
  useEffect(() => {
    // Fungsi untuk menangkap hash atau parameter di URL yang menandakan 
    // pengguna baru saja kembali dari proses OAuth
    const handleRedirect = async () => {
      try {
        // Cek jika ada parameter access_token atau hash di URL 
        // yang menandakan autentikasi berhasil
        const hasAuthParams = window.location.hash.includes('access_token') || 
                              window.location.search.includes('code=');
                              
        if (hasAuthParams) {
          console.log("Detected OAuth redirect, processing authentication...");
          setLoading(true);
          
          // Tunggu proses URL oleh Supabase secara otomatis
          // dan kemudian cek session 
          const user = await checkAuthAndGetSession();
          
          if (user) {
            console.log("OAuth login successful, redirecting to home");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error handling OAuth redirect:", error);
        setLoginError("Gagal memproses login. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    
    handleRedirect();
  }, [navigate, checkAuthAndGetSession]);

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      setLoading(true);
      
      // Memulai proses login Google
      await loginWithGoogle();
      
      // Catatan: Tidak perlu navigate di sini karena loginWithGoogle akan me-redirect
      // user ke Google, dan kemudian kembali ke aplikasi kita yang akan ditangani
      // oleh useEffect handleRedirect di atas
      
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError(error.message || "Login dengan Google gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading ReadingBuku...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login ke ReadingBuku" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <motion.div
        className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-colorback font-text relative"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {/* Tombol Arrow untuk kembali ke halaman utama */}
        <Link
          to="/"
          className="absolute top-6 left-6 bg-yellow-400 hover:bg-yellow-500 text-colorback p-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </Link>

        <div className="card w-full max-w-sm shadow-2xl text-white bg-teal-700">
          <div className="card-body">
            <img src="../book.svg" className="m-auto w-14" alt="Logo" />
            <h2 className="text-2xl font-bold text-center">
              Rea<span className="text-yellow-400">Buk</span>
            </h2>
            
            <div className="text-center mb-4">
              <p className="text-lg">Masuk ke akun Anda</p>
            </div>

            {/* Tampilkan pesan error jika ada */}
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{loginError}</p>
              </div>
            )}

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              className="btn bg-white hover:bg-gray-100 text-gray-800 font-medium flex items-center justify-center gap-2 border-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Login dengan Google
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;