import TourGuideNavBar from "../components/tourGuideNavBar";
import SalesReportTabletourguide from "../components/salestabletourguide";
import LegendEventsTourGuide from "../components/TourGuideSalesReport";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const TourGuideDash = () => {
  return (
    <div>
      <TourGuideNavBar />
      <br></br>
      <LegendEventsTourGuide />
      <br></br>
      <SalesReportTabletourguide />
      <TourismGovernerFooter />
    </div>
  );
};
export default TourGuideDash;
