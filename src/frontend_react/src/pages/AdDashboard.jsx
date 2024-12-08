import NavigationMenuBarAd from "../components/navBarAdvertiser";
import SalesReportTableadvertiser from "../components/salestableadvertiser";
import LegendEventsAdvertiser from "../components/AdvertiserSalesReport";

const AdDashboard = () =>{
    return(
        <div>
<NavigationMenuBarAd/>
<br></br>
<LegendEventsAdvertiser/>
<br></br>
<SalesReportTableadvertiser/>
</div>    );
}
export default AdDashboard;