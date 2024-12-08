import TourGuideNavBar from "../components/tourGuideNavBar";
import SalesReportTabletourguide from "../components/salestabletourguide";
import LegendEventsTourGuide from "../components/TourGuideSalesReport";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import TopCustomersTourGuide from "../components/topCustomersTourGuide";

const TourGuideDash = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TourGuideNavBar />
      <main className="flex-grow p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-1/2">
            <LegendEventsTourGuide />
          </div>
          <div className="w-full md:w-1/2">
            <TopCustomersTourGuide />
          </div>
        </div>
        <SalesReportTabletourguide />
      </main>
      <TourismGovernerFooter />
    </div>
  );
};
export default TourGuideDash;
