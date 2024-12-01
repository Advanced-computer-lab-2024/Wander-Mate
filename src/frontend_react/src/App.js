import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import "./assets/scss/partials/extra/_scrollbar.scss";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationMenuBar from "./components/NavigationMenuBar";
import Places from "./pages/places";
import ErrorPage from "./pages/errorPage";
import Products from "./pages/products";
import AdvertiserHomePage from "./pages/AdvertiserHomePage";
import CreateActivity from "./pages/createActivity";
import ViewAllComplaints from "./components/viewAllComplaints";
import ViewItineraries from "./pages/viewItineraries";
import Rating from "./pages/ratings";
import UploadDocs from "./pages/uploadDocsPage";
import StartPage from "./pages/startPage";
import "./App.css";
import UpdateProfile from "./pages/updateTouristProfile";
import TourismGovHomePage from "./pages/TourismGovHomePage";
import TouristHomePage from "./pages/TouristHomepage";
import Cart from "./components/Cart";
import ProductDetails from "./components/productsDetails";
import ForgotPage from "./pages/forgetPassword";
import FlightOrHotelSearch from "./components/flightOrHotelSearch";
import NewPasswordPage from "./pages/newPasswordPage";
import Rejected from "./pages/rejected";
import Pending from "./pages/pending";
import VerifyPage from "./pages/verifyOTP";
import CommentPage from "./pages/commentPage";
import ProductSeller from "./pages/productSeller";
import SellerProducts from "./pages/SellerProducts";
import BasicMap from "./components/ui/basic-map";
import Transportations from "./pages/transportations";
import CreatePlace from "./components/createPlace";
import ShowWithDocs from "./components/showRegisteredWithDocs";
import TourGuideProfileManager from "./pages/TourGuideProfileManager";
import TransportationCheckout from "./components/payForTransportation";
import AddressCard from "./components/ui/addressCard";
import BookFlight from "./pages/bookFlight";
import HistoricalTagsPage from "./pages/historicaltags";
import PaymentPage from "./pages/Payment";
import Activities from "./pages/activities";
import AddNewAddressCard from "./components/addNewDeliveryAddress";
import PerferenceTagsPage from "./pages/preferenceTags";
import AddressDropDown from "./components/addressDropDown";
import AdvertiserTransportation from "./pages/advertiserTransportation";
import TouristTable from "./pages/touristtable";
import AdvertiserTable from "./pages/advertisertable";
import SellerTable from "./pages/sellertable";
import TourismGovTable from "./pages/tourismgovtable";
import TourGuideTable from "./pages/tourguidetable";
import AdminItineraries from "./pages/adminItineray";
import PayNow from "./components/payNow";
import AdvertiserActivities from "./pages/advertiseractivities";
import HotelCard from "./components/hotelCard";
import PayForFlight from "./components/payForFlight";
import CompletedItineraries from "./components/completedItineraries";
import AdminNavBar from "./components/AdminNavBar";
import Orders from "./components/adminOrders";
import SellerPage from "./pages/productSeller";
// import PurchasedProducts from "./components/purchasedProducts";
import TouristSettings from "./components/TouristSettings";
import TouristPrefrenceTags from "./components/TouristPrefrenceTags";
import HotelCheckout from "./components/hotelCheckout";
import UserProfilePage from "./pages/userProfilePage";
import AboutUs from "./pages/aboutUs";
import MyBookings from "./components/myBookings";
import AdminProducts from "./pages/adminProducts";
import Admin from "./pages/admin";
import RevinueChart from "./components/RevinueChart";
import CompletedActivities from "./components/completedActivities";
import AddAdminButton from "./components/AddAdminButton";
import AddTourismGovButton from "./components/AddTourismGovButton"; 
import LevelAndBadge from "./components/levelAndBadge";
import ItineraryReport from "./components/ui/ItineraryReport";
import AdvertiserProfileManager from "./pages/AdvertiserProfileInformation";
import TourGuideItinerary from "./pages/tourguideItinerary";
import SellerProfileManager from "./pages/SellerProfileInformation";
import TourGuidePage from "./pages/tourGuideHomePage";
import BasicDataTable from "./components/salestable"
import AdminSettings from "./components/AdminSettings";
import AdminPersonalDetails from "./components/AdminPersonalDetails";
import SalesReportTable from "./components/salestable";
import TouristOrders from "./components/touristOrders";
import ChangePhoto from "./components/changePhoto";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/NavigationMenuBar" element={<NavigationMenuBar />} />
        <Route path="/products" element={<Products />} />
        <Route path="/AdvertiserHomepage" element={<AdvertiserHomePage />} />
        <Route path="/createActivity" element={<CreateActivity />} />
        <Route path="/places" element={<Places />} />
        <Route path="/personalDetails" element={<TouristSettings />} />
        <Route path="/viewAllComplaints" element={<ViewAllComplaints />} />
        <Route path="/viewItineraries" element={<ViewItineraries />} />
        <Route path="/ratings" element={<Rating />} />
        <Route path="/uploadDocs" element={<UploadDocs />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<StartPage />} />
        <Route path="/updateTouristProfile" element={<UpdateProfile />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/TourismGovHomePage" element={<TourismGovHomePage />} />
        <Route path="/productsDetails" element={<ProductDetails />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/flight" element={<FlightOrHotelSearch />} />
        <Route path="/bookFlight" element={<BookFlight />} />
        <Route path="/newPassword" element={<NewPasswordPage />} />
        <Route path="/rejected" element={<Rejected />} />
        <Route path="pending" element={<Pending />} />
        <Route path="verifyOtp" element={<VerifyPage />} />
        <Route path="/comment" element={<CommentPage />} />
        <Route path="/productSeller" element={<ProductSeller />} />
        <Route path="/sellerProducts" element={<SellerProducts />} />
        <Route path="/map" element={<BasicMap />} />
        <Route path="/transportations" element={<Transportations />} />
        <Route path="/createPlace" element={<CreatePlace />} />
        <Route path="/showRegisteredWithDocs" element={<ShowWithDocs />} />
        <Route path="/paymentByCard" element={<PaymentPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/tourGuideProfileManager"
          element={<TourGuideProfileManager />}
        />
        <Route
          path="/transportationCheckout"
          element={<TransportationCheckout />}
        />
        <Route path="/payNow" element={<PayNow />} />
        <Route path="/addressCard" element={<AddressCard />} />
        <Route path="/TouristHomePage" element={<TouristHomePage />} />
        <Route path="/historicaltags" element={<HistoricalTagsPage />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/addNewDeliveryAddress" element={<AddNewAddressCard />} />
        <Route path="/PerferenceTagsPage" element={<PerferenceTagsPage />} />
        <Route
          path="/advertiserTransportations"
          element={<AdvertiserTransportation />}
        />
        <Route path="pop" element={<TouristPrefrenceTags />} />
        <Route path="/touristtable" element={<TouristTable />} />
        <Route path="/advertisertable" element={<AdvertiserTable />} />
        <Route path="/sellertable" element={<SellerTable />} />
        <Route path="/tourismgovtable" element={<TourismGovTable />} />
        <Route path="/tourguidetable" element={<TourGuideTable />} />
        <Route path="/orderCard" element={<orderCard />} />
        <Route path="/addressDropDown" element={<AddressDropDown />} />
        <Route path="/adminItineray" element={<AdminItineraries />} />
        <Route path="/hotelcard" element={<HotelCard />} />
        <Route path="/hotelcheckout" element={<HotelCheckout />} />
        <Route path="/advertiserActivities" element={<AdvertiserActivities />} />
        <Route path="/payForFlight" element={<PayForFlight />} />
        <Route path="/adminNavBar" element={<AdminNavBar />} />
        <Route path="/adminOrders" element={<Orders />} />
        <Route path="/sellerProduct" element={<SellerPage />} />
        {/* <Route path="/purchasedProducts" element={<PurchasedProducts />} /> */}
        <Route path="/completedItineraries" element={<CompletedItineraries />} />
        <Route path="/UserProfilePage" element={<UserProfilePage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/revinueChart" element={<RevinueChart />} />
        <Route path="/completedActivities" element={<CompletedActivities />} />
        <Route path="/levelAndBadge" element={<LevelAndBadge />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/AddAdminButton" element={<AddAdminButton />} />
        <Route path="/AddTourismGovButton" element={<AddTourismGovButton />} />
        <Route path="/ItineraryReport" element={<ItineraryReport />} />
        <Route path="/AdvertiserProfileInformation" element={<AdvertiserProfileManager />} />
        <Route path="/AdminSettings" element={<AdminSettings />} />
        <Route path="/AdminPersonalDetails" element={<AdminPersonalDetails />} />
        <Route path="/TourGuideItinerary" element={<TourGuideItinerary />} />
        <Route path="/SellerProfileInformation" element={<SellerProfileManager />} />
        <Route path="/TourGuidePage" element={<TourGuidePage/>}/>
        <Route path="/AdminProducts" element={<AdminProducts/>}/>
        <Route path="/salestable" element={<SalesReportTable/>}/>
        <Route path="/TouristOrders" element={<TouristOrders/>}/>
        
        <Route path="ChangePhoto" element={<ChangePhoto />} />
      </Routes>
    </Router>
  );
}

export default App;
