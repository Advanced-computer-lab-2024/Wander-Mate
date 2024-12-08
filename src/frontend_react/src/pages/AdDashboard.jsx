import NavigationMenuBarAd from "../components/navBarAdvertiser";
import SalesReportTableadvertiser from "../components/salestableadvertiser";
import LegendEventsAdvertiser from "../components/AdvertiserSalesReport";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const AdDashboard = () => {
  return (
    <div>
      <NavigationMenuBarAd />
      <br></br>
      <LegendEventsAdvertiser />
      <br></br>
      <SalesReportTableadvertiser />
      <TourismGovernerFooter />
    </div>
  );
};
export default AdDashboard;
