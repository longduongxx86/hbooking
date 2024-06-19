import { cn } from "@/shared/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { REPORT_PATHS } from "@/features/report/constants";

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title?: string;
    childrens: {
      icon: React.ReactNode;
      href: string;
      title: string;
    }[];
  }[];
}

const Navigation = ({ className, items, ...props }: NavigationProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    return navigate(path);
  };

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="pb-4 space-y-4">
        <div className="px-3">
          <div className="py-4 text-2xl font-bold tracking-tight text-center text-white">
            <Link to={REPORT_PATHS.REPORT}>MH</Link>
          </div>
          <div className="space-y-4">
            {items.map(({ title, childrens }, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold tracking-tight">
                  {title}
                </h2>
                <Separator className="my-2" />
                <div className="space-y-1">
                  {childrens.map(({ title, href, icon }, index) => (
                    <Button
                      variant={
                        !!pathname.includes(href.split("/")?.[1])
                          ? "secondary"
                          : "ghost"
                      }
                      className="justify-start w-full"
                      key={index}
                      onClick={() => handleNavigate(href)}
                    >
                      <div>{icon}</div>
                      {title}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
