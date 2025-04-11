import ServerIconButton from "@/public/components/serverIconButton";

const SideUiContent = ({ serverData }: { serverData: { name: string }[] }) => {
  return (
    <ul>
      {serverData.map((server: { name: string }) => (
        <ServerIconButton key={server.name} imageUrl={"/assets/discord_blue.png"} name={server.name} />
      ))}
    </ul>
  );

  // <ul>
  //
  //   {serverData.map((server: { name: string }) => {
  //     <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />;
  //     <li key={server.id}>
  //       <img src={server.icon} alt={server.name}/>
  //       <span>{server.name}</span>
  //     </li>
  //   })}
  // </ul>;
};

export default SideUiContent;
