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
import PersonalDetails from "./components/personalDetails";
import ViewAllComplaints from "./components/viewAllComplaints";
import ChangePasword from "./components/changePassword";
import ViewItineraries from "./pages/viewItineraries";
import Rating from "./pages/ratings";
import UploadDocs from "./pages/uploadDocsPage";
import StartPage from "./pages/startPage";
import "./App.css";
import UpdateProfile from "./pages/updateTouristProfile";
import UpdateTouristProfile from "./components/updateTouristInfo";
import TourismGovHomePage from "./pages/TourismGovHomePage";
import Cart from "./components/Cart";
import ProductDetails from "./components/productsDetails";
import ForgotPage from "./pages/forgetPassword";
import FlightOrHotelSearch from "./components/flightOrHotelSearch";
import NewPasswordPage from "./pages/newPasswordPage";
import Rejected from "./pages/rejected";
import Pending from "./pages/pending";
import VerifyPage from "./pages/verifyOTP";
import AddressCard from "./components/ui/addressCard";
import CommentPage from "./pages/commentPage";
import ProductSeller from "./pages/productSeller";
import SellerProducts from "./pages/SellerProducts";
import BasicMap from "./components/ui/basic-map";
import Transportations from "./pages/transportations";
import CreatePlace from "./components/createPlace";
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
        <Route path="/personalDetails" element={<PersonalDetails />} />
        <Route path="/viewAllComplaints" element={<ViewAllComplaints />} />
        <Route path="/viewItineraries" element={<ViewItineraries />} />
        <Route path="/ratings" element={<Rating />} />
        <Route path="/changePassword" element={<ChangePasword />} />
        <Route path="/uploadDocs" element={<UploadDocs />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<StartPage />} />
        <Route path="/updateTouristProfile" element={<UpdateProfile />} />
        <Route path="/updateTouristInfo" element={<UpdateTouristProfile />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/TourismGovHomePage" element={<TourismGovHomePage />} />
        <Route path="/productsDetails" element={<ProductDetails />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/flight" element={<FlightOrHotelSearch />} />
        <Route path="/newPassword" element={<NewPasswordPage />} />
        <Route path="/rejected" element={<Rejected />} />
        <Route path="pending" element={<Pending />} />
        <Route path="verifyOtp" element={<VerifyPage />} />
        <Route path="/comment" element={<CommentPage />} />
        <Route path="/addressCard" element={<AddressCard />} />
        <Route path="/productSeller" element={<ProductSeller />} />
        <Route path="/sellerProducts" element={<SellerProducts />} />
        <Route path="/map" element={<BasicMap />} />
        <Route path="/transportations" element={<Transportations />} />
        <Route path="/createPlace" element={<CreatePlace />} />
      </Routes>
    </Router>
  );
}

export default App;
