"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DmList } from "@/components/type/response";
import { dmsQueryKey } from "@/components/dm/use-dms-query";

export function DmHydrator({ dmList }: { dmList: DmList[] }) {
  const queryClient = useQueryClient();
  useState(() => {
    queryClient.setQueryData(dmsQueryKey, dmList ?? []);
  });

  return null;
}
