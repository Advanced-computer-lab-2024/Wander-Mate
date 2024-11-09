import NavigationMenuBar from "../components/NavigationMenuBar";
import UpdateTouristInfo from "../components/updateTouristInfo";

const UpdateTouristProfile = () => {
    return ( 
        <div>
            <NavigationMenuBar />
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}>
                <UpdateTouristInfo />
            </div>
        </div>
     );
}

export default UpdateTouristProfile;
