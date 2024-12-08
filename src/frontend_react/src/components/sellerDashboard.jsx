import SellerNavBar from "../components/sellerNavBar";
import LegendEventsSeller from "./SellerSalesReport";
import SalesReportTable from "./salestableseller";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const SellerDashboard = () => {
  return (
    <div>
      <SellerNavBar />
      <br />
      <div className="left">
        <LegendEventsSeller />
      </div>
      <br />
      <SalesReportTable />
      <TourismGovernerFooter />
    </div>
  );
};

export default SellerDashboard;
