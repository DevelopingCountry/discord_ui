"use client";
import { friendsDataType } from "@/components/type/response";
import { createContext, useContext, useState } from "react";
interface FriendsContextType {
  friendsData: friendsDataType[];
  setFriendsData: (friendsData: friendsDataType[]) => void;
}
const FriendsContext = createContext<FriendsContextType | null>(null);
export const useFriendsContext = () => useContext(FriendsContext);

export const FriendsProvider = ({
  friendsData,
  children,
}: {
  friendsData: friendsDataType[];
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<friendsDataType[]>(friendsData);
  const setFriendsData = (newFriendsData: friendsDataType[]) => {
    setState(newFriendsData);
  };
  return <FriendsContext.Provider value={{ friendsData: state, setFriendsData }}>{children}</FriendsContext.Provider>;
};
