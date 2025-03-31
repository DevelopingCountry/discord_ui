import { Tool } from "@/public/homeDir/components/Tool";

export function ToolBar() {
  return (
    <div className={"flex z-40 fixed right-1 bg-discord2and3"}>
      <Tool src={"/assets/invite-group-message.svg"} />
      <Tool src={"/assets/invite-group-message.svg"} />
      <Tool src={"/assets/icons8-help-32.png"} />
    </div>
  );
}
