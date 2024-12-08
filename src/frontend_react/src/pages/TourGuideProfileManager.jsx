import React, { useState, useEffect } from "react";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import axios from "axios";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star } from "lucide-react";
import ChangePassword from "../components/changePassword";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import CustomConfirmationDialog from "../components/ui/confirmationDialog";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:8000";

const TourGuideProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [touristBadge, setTouristBadge] = useState(null);
  const username = sessionStorage.getItem("username");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      setErrorMessage("Username not found. Please log in or register.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/readProfileInformation/${encodeURIComponent(username)}`
        );

        let pictureUrl = null;
        if (data.picture && data.picture.data) {
          const base64String = btoa(
            new Uint8Array(data.picture.data).reduce(
              (acc, byte) => acc + String.fromCharCode(byte),
              ""
            )
          );
          pictureUrl = `data:image/jpeg;base64,${base64String}`;
        }

        setProfile(data);
        setProfilePicture(pictureUrl);
        setYearsOfExperience(data.YearsOfExperience || 0); // Initialize with profile data
        setTouristBadge(data.status);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred while fetching the profile."
        );
      }
    };

    fetchProfile();
  }, [username]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append("Username", username);

    try {
      const { data } = await axios.put(
        `${API_URL}/updateProfileInformation`,
        Object.fromEntries(formData)
      );
      setProfile(data.tourGuide);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = () => {
    setIsConfirmationOpen(true);
  };
  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };
  const handleDeleteAccount = async () => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/requestTourGuideAccountDeletion/${profile._id}`
      );
      toast.success(data.message);
      // Optionally clear session and redirect
      sessionStorage.clear();
      navigate("/LoginPage");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the account."
      );
    }
  };
  if (errorMessage) {
    return <div style={{ color: "red" }}>{errorMessage}</div>;
  }
  const handleYearsOfExperienceChange = (event) => {
    const value = Math.max(0, parseInt(event.target.value, 10)); // Ensure non-negative value
    setYearsOfExperience(value);
  };

  if (errorMessage) {
    return <div style={{ color: "red" }}>{errorMessage}</div>;
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <React.Fragment>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="changePassword">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <br></br>
                  {/* Username */}
                  <div>
                    <Label htmlFor="Username">Username</Label>
                    <Input
                      id="Username"
                      name="Username"
                      defaultValue={profile?.Username || ""}
                      disabled={true}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      name="Email"
                      type="email"
                      defaultValue={profile?.Email || ""}
                      disabled={true}
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <Label htmlFor="MobileNumber">Mobile Number</Label>
                    <Input
                      id="MobileNumber"
                      name="MobileNumber"
                      defaultValue={profile?.MobileNumber || ""}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {/* Previous Work */}
                  <div>
                    <Label htmlFor="PreviousWork">Previous Work</Label>
                    <Input
                      id="PreviousWork"
                      name="PreviousWork"
                      defaultValue={profile?.PreviousWork || ""}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <Label htmlFor="YearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="YearsOfExperience"
                      name="YearsOfExperience"
                      type="number"
                      value={yearsOfExperience}
                      onChange={handleYearsOfExperienceChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {/* <div className="flex items-center">
                  <Label>Status</Label>
                  <Badge className="ml-2">
                    <Star className="mr-1 h-3 w-3" />
                    {touristBadge ? touristBadge : "Loading..."}
                  </Badge>
                </div> */}

                  {/* Toggle Edit Mode */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>

                    {isEditing && <Button type="submit">Save Changes</Button>}
                    <Button
                      type="button"
                      color="destructive"
                      onClick={handleDelete}
                    >
                      Delete Account
                    </Button>
                    <CustomConfirmationDialog
                      isOpen={isConfirmationOpen}
                      onConfirm={handleDeleteAccount}
                      onCancel={handleCancelDelete}
                      message="Are you sure you want to delete this Account?"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="changePassword">
            <ChangePassword URL="http://localhost:8000/changePasswordTourGuide" />
          </TabsContent>
        </Tabs>
      </div>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default TourGuideProfileManager;
