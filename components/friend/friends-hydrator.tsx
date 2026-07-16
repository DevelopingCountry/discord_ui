"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { friendsQueryKey } from "@/components/friend/use-friends-query";
import { friendsDataType } from "@/components/type/response";

export function FriendsHydrator({ friendsData }: { friendsData: friendsDataType[] }) {
  const queryClient = useQueryClient();
  useState(() => {
    queryClient.setQueryData(friendsQueryKey, friendsData ?? []);
  });

  return null;
}
