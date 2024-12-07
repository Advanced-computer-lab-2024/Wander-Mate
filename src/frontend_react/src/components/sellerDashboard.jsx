import SellerNavBar from '../components/sellerNavBar';
import LegendEventsSeller from './SellerSalesReport';
import SalesReportTable from './salestableseller';

const SellerDashboard = () => {

    return (
        <div>
            <SellerNavBar />
            <br />
            <div className='left'>
                <LegendEventsSeller />
            </div>
            <br />
            <SalesReportTable />
        </div>
    );
};

export default SellerDashboard;
