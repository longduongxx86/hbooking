import PageTitle from "@/components/PageTitle";
import { ExpandIcon, HomeIcon, LayoutDashboard } from "lucide-react";
import { useReportQuery } from "../api/useReportQuery";
import FilterReport from "../components/FiterReport";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatter } from "@/utils/formatter";
import { RecentSales } from "../components/RecentSales";
import { HomestayOverview } from "../components/HomestayOverview";
import { UserOverview } from "../components/UserOverview";
import { useLocation } from "react-router-dom";

const ReportScreen = () => {
  const { search } = useLocation();
  const { data, isSuccess } = useReportQuery();

  const revenue = data?.data.data.revenue;

  return (
    <>
      <PageTitle icon={<ExpandIcon />}>Báo cáo</PageTitle>
      <FilterReport />
      <div className="mt-8 grid gap-4 grid-cols-2 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(revenue?.total_revenue || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số lượng homestay
            </CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenue?.homestays?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quát người dùng</CardTitle>
          </CardHeader>
          {isSuccess && (
            <CardContent className="pl-2">
              <UserOverview revenueBreakdowns={revenue?.revenue_breakdowns} />
            </CardContent>
          )}
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quát homestay</CardTitle>
          </CardHeader>
          {isSuccess && (
            <CardContent className="pl-2">
              <HomestayOverview />
            </CardContent>
          )}
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales revenueBreakdowns={revenue?.revenue_breakdowns} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReportScreen;
