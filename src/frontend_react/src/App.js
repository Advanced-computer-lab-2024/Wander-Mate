import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TouristHomePage from "./pages/TouristHomepage";
import NavigationMenuBar from "./pages/NavigationMenuBar";
import Places from "./pages/places";

import Products from "./pages/products";
import AdvertiserHomePage from "./pages/AdvertiserHomePage";
import CreateActivity from "./pages/createActivity";
import PersonalDetails from "./components/personalDetails";
import ViewAllComplaints from "./components/viewAllComplaints";
import ViewItineraries from "./pages/viewItineraries";
import Rating from "./pages/ratings";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/TouristHomepage" element={<TouristHomePage />} />
        <Route path="/NavigationMenuBar" element={<NavigationMenuBar />} />
        <Route path="/products" element={<Products />} />
        <Route path="/AdvertiserHomepage" element={<AdvertiserHomePage />} />
        <Route path="/createActivity" element={<CreateActivity />} />
        <Route path="/places" element={<Places />} />
        <Route path="/personalDetails" element={<PersonalDetails />} />
        <Route path="/viewAllComplaints" element={<ViewAllComplaints/>}/>
        <Route path="/viewItineraries" element={<ViewItineraries/>}/>
        <Route path="/ratings" element={<Rating/>}/>
      </Routes>
    </Router>
  );
}

export default App;
