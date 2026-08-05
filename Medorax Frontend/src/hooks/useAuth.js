import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, signup } from "../api/auth.api.js";
import { getProfile, updateProfile } from "../api/profile.api";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(login, {
    onSuccess: (data) => {
      const { token, userId, name, email } = data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      // Optionally store user info
      queryClient.setQueryData(["auth", "user"], { userId, name, email });
    },
  });
};

// Signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation(signup, {
    onSuccess: () => {
      // After successful signup you might auto‑login or redirect
      queryClient.invalidateQueries(["auth", "signup"]);
    },
  });
};

// Fetch current user profile
export const useProfile = () => {
  const userId = localStorage.getItem("userId");
  return useQuery(["profile", userId], () => getProfile().then((res) => res.data), {
    enabled: !!userId,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProfile, {
    onSuccess: () => {
      const userId = localStorage.getItem("userId");
      queryClient.invalidateQueries(["profile", userId]);
    },
  });
};

export const useLogout = () => {
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Optionally clear react‑query cache
  };
};
