import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TouristHomePage from "./pages/TouristHomepage";
import AdvertiserHomePage from "./pages/AdvertiserHomePage";
import CreateActivity from './pages/createActivity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/TouristHomepage" element={<TouristHomePage />} />
        <Route path="/AdvertiserHomepage" element={<AdvertiserHomePage />} />
        <Route path="/createActivity" element={<CreateActivity />} />
      </Routes>
    </Router>
  );
}

export default App;
