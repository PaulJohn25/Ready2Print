import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <>
      <div className="w-full bg-slate-200 mx-auto flex flex-col gap-12">
        {children}
      </div>
      <Toaster />
    </>
  );
};

export default RootLayout;
