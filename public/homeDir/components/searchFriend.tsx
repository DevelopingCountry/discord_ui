"use client";
import ChatMessage from "@/components/chat-message";
import SearchBar from "@/components/search-bar";
import { useActiveStore, useSearchStore } from "@/components/store/useSearchStore";
import { friendsDataType } from "@/app/page";

const SearchFriend = ({ friends }: { friends: friendsDataType }) => {
  const { isActive } = useActiveStore();
  const { searchText } = useSearchStore();
  console.log(isActive === "");
  const filteredActiveFriends = friends.filter((friend) => {
    if (isActive === "모두") {
      return friend.friendStatus === "ACCEPTED";
    }
    return friend.friendStatus === "PENDING";
  });
  const filteredFriends = filteredActiveFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className={"flex-1"}>
      <SearchBar />

      <div className={"bg-discord1and4 flex-1 overflow-y-auto max-h-[calc(100vh-82px)] custom-scrollbar"}>
        <ul>
          {filteredFriends.map((friend, index) => (
            <li key={index}>
              <ChatMessage name={friend.name} status={"행인1"} />
            </li>
          ))}
          {/*{friends.map((friend, index) => (*/}
          {/*  <li key={index} className={"h-44 text-amber-50 mb-3 flex justify-center items-center "}>*/}
          {/*    {friend.name}*/}
          {/*  </li>*/}
          {/*))}*/}
        </ul>
      </div>
    </div>
  );
};

export default SearchFriend;
