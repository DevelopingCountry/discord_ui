export default function SectionOneAndFour({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col  bg-amber-400 relative">
      {children}
    </div>
  );
}
