import NavigationMenuBarAd from "../components/navBarAdvertiser";
import SalesReportTableadvertiser from "../components/salestableadvertiser";
import LegendEventsAdvertiser from "../components/AdvertiserSalesReport";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import TopCustomersAdvertiser from "../components/topCustomersAdvertiser";
const AdDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenuBarAd />
      <main className="flex-grow p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-1/2">
            <LegendEventsAdvertiser />
          </div>
          <div className="w-full md:w-1/2">
           <TopCustomersAdvertiser/>
          </div>
        </div>
        <SalesReportTableadvertiser />
      </main>
      <TourismGovernerFooter />
    </div>
  );
};
export default AdDashboard;
