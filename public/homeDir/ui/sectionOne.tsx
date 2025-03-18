function SectionOne({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "px-4 shadow-elevationLow z-20 h-[48px] bg-amber-200 flex justify-between items-center"
      }
    >
      {children}
    </div>
  );
}

export default SectionOne;
