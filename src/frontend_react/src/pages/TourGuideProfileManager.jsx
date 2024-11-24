import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

const API_URL = "http://localhost:8000";

const TourGuideProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const username = sessionStorage.getItem("username");

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

  if (errorMessage) {
    return <div style={{ color: "red" }}>{errorMessage}</div>;
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div>
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    {profilePicture && (
                      <img
                        src={profilePicture || "default-profile.png"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="Name">Name</Label>
                  <Input
                    id="Name"
                    name="Name"
                    defaultValue={profile?.FullName || ""}
                    disabled={!isEditing}
                    required
                  />
                </div>

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
                    disabled={!isEditing}
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
                  <Label htmlFor="YearsOfExperience">Years of Experience</Label>
                  <Input
                    id="YearsOfExperience"
                    name="YearsOfExperience"
                    type="number"
                    defaultValue={profile?.YearsOfExperience || ""}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* Toggle Edit Mode */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  {isEditing && <Button type="submit">Save Changes</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TourGuideProfileManager;