import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupaClient";
import { Helmet } from "react-helmet";
import Header from "../home/Header";
import { useAuth } from "../auth/UseAuth";

const UpdateProfile = () => {
  const {
    full_name,
    email,
    username,
    avatar_url,
    user,
    updateProfile,
    fetchUserData,
    loading,
  } = useAuth();

  // State for form fields
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLink, setAvatarLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const navigate = useNavigate();

  // Animation variants
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  // Initialize component with user data
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Make sure we have a user
        if (!user) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!session) {
            navigate("/login");
            return;
          }
        }

        // Refresh user data to ensure we have the latest
        if (user?.id) {
          await fetchUserData(user.id);
        }

        // Initialize form with current values
        setName(full_name || "");
        setNewEmail(email || "");
        setNewUsername(username || "");

        // Handle avatar URL properly from Supabase storage
        if (avatar_url) {
          const avatarPublicUrl = getAvatarUrl(avatar_url);
          setAvatar(avatarPublicUrl);
        }
      } catch (error) {
        console.error("Error initializing profile form:", error);
        setFormError("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, [user, full_name, email, username, avatar_url, fetchUserData, navigate]);

  // Function to get avatar URL from Supabase storage
  const getAvatarUrl = (url) => {
    if (!url) return null;

    // Check if avatar_url is already a full URL (starts with http or https)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If avatar_url is a storage path, generate a public URL
    try {
      const publicURL = supabase.storage.from("avatars").getPublicUrl(url)
        .data.publicUrl;

      return publicURL;
    } catch (error) {
      console.error("Error getting avatar URL:", error);
      return null;
    }
  };

  // Handle form submission
  // Tambahkan debugging di UpdateProfile.jsx

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    console.log("=== DEBUG UPDATE PROFILE ===");
    console.log("Current user:", user);
    console.log("Form data:", {
      name: name.trim(),
      newEmail: newEmail.trim(),
      newUsername: newUsername.trim(),
      avatarPath: avatar_url,
    });

    // Validasi
    if (!name.trim()) {
      setFormError("Full name is required");
      return;
    }

    if (!newEmail.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!newUsername.trim()) {
      setFormError("Username is required");
      return;
    }

    try {
      setIsLoading(true);

      if (!user) {
        setFormError("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      console.log("User ID for update:", user.id);

      // Test connection ke Supabase terlebih dahulu
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Current profile data:", testData);
      console.log("Test error:", testError);

      // Handle avatar upload jika ada
      let avatarPath = avatar_url;

      if (avatarFile) {
        console.log("Uploading avatar file...");
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          setFormError("Failed to upload avatar image. Please try again.");
          setIsLoading(false);
          return;
        }

        avatarPath = filePath;
        console.log("Avatar uploaded to:", avatarPath);
      } else if (
        avatarLink &&
        (avatarLink.startsWith("http://") || avatarLink.startsWith("https://"))
      ) {
        avatarPath = avatarLink;
        console.log("Using external avatar URL:", avatarPath);
      }

      console.log("Final data to update:", {
        userId: user.id,
        full_name: name.trim(),
        email: newEmail.trim(),
        username: newUsername.trim(),
        avatar_url: avatarPath,
      });

      // Coba update langsung dulu untuk debug
      const { data: directUpdate, error: directError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          email: newEmail.trim(),
          username: newUsername.trim(),
          avatar_url: avatarPath,
        })
        .eq("id", user.id)
        .select();

      console.log("Direct update result:", directUpdate);
      console.log("Direct update error:", directError);

      if (directError) {
        console.error("Direct update failed:", {
          message: directError.message,
          details: directError.details,
          hint: directError.hint,
          code: directError.code,
        });

        // Coba dengan upsert
        console.log("Trying upsert...");
        const { data: upsertData, error: upsertError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: name.trim(),
            email: newEmail.trim(),
            username: newUsername.trim(),
            avatar_url: avatarPath,
          })
          .select();

        console.log("Upsert result:", upsertData);
        console.log("Upsert error:", upsertError);

        if (upsertError) {
          setFormError(`Update failed: ${upsertError.message}`);
          return;
        }
      }

      // Update using store function
      const success = await updateProfile(
        user.id,
        name.trim(),
        newEmail.trim(),
        newUsername.trim(),
        avatarPath
      );

      console.log("Store update success:", success);

      if (success) {
        setFormSuccess("Profile updated successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setFormError(
          "Failed to update profile. Please check console for details."
        );
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setFormError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload for avatar
  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image is too large. Please select an image under 5MB.");
        return;
      }

      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setAvatar(objectUrl);
      // Save file for later upload
      setAvatarFile(file);
    } catch (error) {
      console.error("Error handling avatar upload:", error);
      setFormError("Failed to upload avatar image.");
    }
  };

  // Handle using image URL for avatar
  const handleAvatarLinkChange = () => {
    if (!avatarLink.trim()) {
      setFormError("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(avatarLink);

      // Test if the image can be loaded
      const img = new Image();
      img.onload = () => {
        setAvatar(avatarLink);
        setAvatarFile(null); // Clear file if using URL
        setFormError("");
      };
      img.onerror = () => {
        setFormError(
          "Could not load image from this URL. Please check the URL or try a different one."
        );
      };
      img.src = avatarLink;
    } catch (error) {
      setFormError("Please enter a valid URL");
    }
  };

  // Show loading spinner while data is being fetched
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Update Profile</title>
        <meta name="description" content="Update your profile information" />
        <meta name="keywords" content="Wonderful Shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
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
        className="bg-colorback dark:bg-gray-900 max-lg:pt-24"
      >
        <Header />
        <div className="min-h-screen bg-colorback dark:from-zinc-800 dark:to-zinc-900 flex flex-col items-center py-12 px-4 max-md:mt-10">
          <motion.div
            className="bg-white dark:bg-zinc-700 shadow-lg rounded-2xl w-11/12 sm:w-3/4 lg:w-1/2 p-8 text-center"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-6">
              Update Profile
            </h2>

            {/* Error message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {formError}
              </div>
            )}

            {/* Success message */}
            {formSuccess && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
                {formSuccess}
              </div>
            )}

            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-colorback overflow-hidden shadow-md mb-4 border-4 border-yellow-500">
                <button
                  type="button"
                  onClick={() => document.getElementById("avatarInput").click()}
                  className="w-full h-full block focus:outline-none"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Error loading avatar preview");
                        e.target.onerror = null;
                        // Fallback ke inisial
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                          <span class="text-4xl font-bold">${(name ||
                            newEmail ||
                            "U")[0].toUpperCase()}</span>
                        </div>`;
                        setFormError(
                          "Failed to load image. Please try again with a different image."
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                      <span className="text-4xl font-bold">
                        {(name || newEmail || "U")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
              </div>
              <input
                id="avatarInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <div className="flex flex-col sm:flex-row w-full gap-2 mt-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 dark:bg-zinc-600 dark:text-white dark:border-0 border border-gray-300 rounded-md focus:ring focus:ring-yellow-300"
                  placeholder="Enter image URL"
                  value={avatarLink}
                  onChange={(e) => setAvatarLink(e.target.value)}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                  onClick={handleAvatarLinkChange}
                >
                  Use Link
                </button>
              </div>
            </div>

            <form className="flex flex-col gap-4 mt-6" onSubmit={handleUpdate}>
              <div className="flex flex-col">
                <label
                  htmlFor="fullName"
                  className="text-left text-gray-700 dark:text-gray-300 mb-1 text-sm"
                >
                  Full Name*
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="px-4 py-2 dark:bg-zinc-600 dark:text-white dark:border-0 border border-gray-300 rounded-md focus:ring focus:ring-yellow-300"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-left text-gray-700 dark:text-gray-300 mb-1 text-sm"
                >
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  className="px-4 py-2 dark:bg-zinc-600 dark:text-white dark:border-0 border border-gray-300 rounded-md focus:ring focus:ring-yellow-300"
                  placeholder="Enter your email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="username"
                  className="text-left text-gray-700 dark:text-gray-300 mb-1 text-sm"
                >
                  Username*
                </label>
                <input
                  id="username"
                  type="text"
                  className="px-4 py-2 dark:bg-zinc-600 dark:text-white dark:border-0 border border-gray-300 rounded-md focus:ring focus:ring-yellow-300"
                  placeholder="Enter your username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>

                <button
                  type="button"
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md transition duration-300"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default UpdateProfile;
