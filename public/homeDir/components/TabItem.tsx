import { useRouter } from "next/navigation";

const TabItem = ({ label, isActive }: { label: string; isActive: boolean }) => {
  const router = useRouter();

  const onClick = () => {
    console.log(label);
    router.push(`/channel/${label}`);
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-md flex-shrink-0 ${
        isActive
          ? "bg-gray-600 text-white"
          : "bg-discord1and4 text-gray-300 hover:bg-gray-600 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
};

export default TabItem;
