"use client";
import { Profile } from "@/components/type/response";
import { useEffect } from "react";
import { useProfileStore } from "@/components/store/use-profile";

export const MyProfileHydrator = ({ myProfile }: { myProfile: Profile }) => {
  const { setProfile } = useProfileStore();

  // useLayoutEffect(() => {
  //   setServers(servers);
  // }, [servers, setServers]);
  useEffect(() => {
    setProfile(myProfile);
    console.log("hydrate component");
  }, [myProfile, setProfile]);

  return null;
};
