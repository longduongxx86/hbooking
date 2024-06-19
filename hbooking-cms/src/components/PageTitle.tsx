import { ReactNode } from "react";

type PageTitleProps = { children: ReactNode; icon: ReactNode };
const PageTitle = ({ children, icon }: PageTitleProps) => {
  return (
    <div className="text-xl font-bold pb-4 flex gap-1 items-center">
      {icon}
      {children}
    </div>
  );
};

export default PageTitle;
