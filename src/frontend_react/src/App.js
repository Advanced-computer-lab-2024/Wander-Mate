import "./App.css";
import StartPage from "./components/screens/startPage";
import Register1 from "./components/screens/register1";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TouristRegister from "./components/screens/touristRegister";
import SellerRegister from "./components/screens/sellerRegister";
import TourGuideRegister from "./components/screens/tourGuideRegister";
import AdvertiserRegister from "./components/screens/advertiserRegister";
import SellerRegister2 from "./components/screens/sellerRegister2";
import  TouristRegister2 from "./components/screens/touristRegister2";


function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/registerStart" element={<Register1 />} />
          <Route path="/touristRegister" element={<TouristRegister />} />
          <Route path="/sellerRegister" element={<SellerRegister />} />
          <Route path="/guideRegister" element={<TourGuideRegister />} />
          <Route path="/advertiserRegister" element={<AdvertiserRegister />} />
          <Route path="/sellerPassword" element={<SellerRegister2 />} />
          <Route path="/touristPassword" element={<TouristRegister2 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
