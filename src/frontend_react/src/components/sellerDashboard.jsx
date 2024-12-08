import SellerNavBar from "../components/sellerNavBar";
import LegendEventsSeller from "./SellerSalesReport";
import SalesReportTable from "./salestableseller";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import TopCustomersSeller from "../components/topCustomersSeller";

const SellerDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavBar />
      <main className="flex-grow p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-1/2">
            <LegendEventsSeller />
          </div>
          <div className="w-full md:w-1/2">
            <TopCustomersSeller />
          </div>
        </div>
        <SalesReportTable />
      </main>
      <TourismGovernerFooter />
    </div>
  );
};

export default SellerDashboard;

