import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TouristHomePage from "./pages/TouristHomepage";
import NavigationMenuBar from "./pages/NavigationMenuBar";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/TouristHomepage" element={<TouristHomePage />} />
        <Route path="/NavigationMenuBar" element={<NavigationMenuBar />} />
      </Routes>
    </Router>
  );
}

export default App;
