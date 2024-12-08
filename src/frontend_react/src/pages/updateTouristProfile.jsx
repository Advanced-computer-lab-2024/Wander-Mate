import NavigationMenuBar from "../components/NavigationMenuBar";
import UpdateTouristInfo from "../components/updateTouristInfo";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const UpdateTouristProfile = () => {
  return (
    <div>
      <NavigationMenuBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <UpdateTouristInfo />
      </div>
      <TourismGovernerFooter />
    </div>
  );
};

export default UpdateTouristProfile;
