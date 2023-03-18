import React from "react";

export interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-background">
      {children}
    </div>
  );
};

export default Page;
