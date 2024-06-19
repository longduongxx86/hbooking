import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { AUTH_PATHS, useAuth } from "@/features/auth";
import { BOOKING_PATHS } from "@/features/booking/constants";
import { HOMESTAY_PATHS } from "@/features/homestay";
import { REPORT_PATHS } from "@/features/report/constants";
import { ROOM_PATHS } from "@/features/room";
import { SERVICE_PATHS } from "@/features/service/constants";
import {
  BedSingle,
  ExpandIcon,
  HomeIcon,
  ListOrdered,
  PlusIcon,
} from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const navItems = [
  {
    childrens: [
      {
        icon: <ExpandIcon className="w-4 h-4 mr-2" />,
        title: "Báo cáo",
        href: REPORT_PATHS.REPORT,
      },
      {
        icon: <HomeIcon className="w-4 h-4 mr-2" />,
        title: "Homestay",
        href: HOMESTAY_PATHS.HOMESTAY,
      },
      {
        icon: <BedSingle className="w-4 h-4 mr-2" />,
        title: "Phòng",
        href: ROOM_PATHS.ROOMS,
      },
      {
        icon: <PlusIcon className="w-4 h-4 mr-2" />,
        title: "Dịch vụ",
        href: SERVICE_PATHS.SERVICES,
      },
      {
        icon: <ListOrdered className="w-4 h-4 mr-2" />,
        title: "Đặt phòng",
        href: BOOKING_PATHS.BOOKING,
      },
    ],
  },
];

const DefaultLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.LOG_IN} replace />;
  }

  return (
    <div className="w-full h-screen relative">
      <div className="h-full bg-background">
        <div className="grid grid-cols-[300px_1fr] h-full">
          <Navigation
            items={navItems}
            className="h-full text-white bg-primary"
          />
          <div className="flex-1 lg:border-l">
            <Header />
            <div className="p-4 container-right">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute top-0 w-full h-full bg-black/60 z-10 ${
          isLoading ? "" : "hidden"
        }`}
      >
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <div
            className=" w-12 h-12 rounded-full animate-spin
          border-4 border-solid border-white border-t-transparent"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
