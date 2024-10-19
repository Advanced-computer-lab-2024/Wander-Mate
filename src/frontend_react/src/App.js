import "./App.css";
import MainNav from "./components/ui/mainNav";
import StartPage from "./components/screens/startPage";
import OurService from "./components/blocks/OurServiceBlock";
import OurAcheivementsBlock from "./components/blocks/OurAcheivementsBlock";
function App() {
  return (
    <div className="container">
      <MainNav />
      <StartPage />
      <OurService/>
      <OurAcheivementsBlock/>
    </div>
  );
}

export default App;
