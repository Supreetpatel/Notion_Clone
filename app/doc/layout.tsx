import LiveBlocksProvider from "@/components/LiveBlocksProvider";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};

export default PageLayout;
