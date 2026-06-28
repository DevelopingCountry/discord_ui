"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/components/store/use-profile";
import { API_URL } from "@/lib/config";

export function ProfileHydrator() {
  const { setProfile, isFetched } = useProfileStore();

  useEffect(() => {
    if (isFetched) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.response) setProfile(data.response);
      })
      .catch(console.error);
  }, [isFetched, setProfile]);

  return null;
}
