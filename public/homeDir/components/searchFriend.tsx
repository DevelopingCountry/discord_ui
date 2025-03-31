const SearchFriend = ({ friends }: { friends: { name: string }[] }) => {
  return (
    <div className={"flex-1"}>
      <div className={"w-full mx-3 flex h-[34px] pt-2 shadow-elevationLow justify-center items-center"}>
        <input placeholder={"검색하기"} className={"w-full"}></input>
        <div className={"bg-amber-950"}>icon</div>
      </div>
      <div className={"bg-discord1and4 flex-1 overflow-y-auto max-h-[calc(100vh-82px)] custom-scrollbar"}>
        <ul>
          {friends.map((friend, index) => (
            <li key={index} className={"h-44 text-amber-50 mb-3 flex justify-center items-center"}>
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFriend;
