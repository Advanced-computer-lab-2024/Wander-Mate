import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star } from "lucide-react";

const API_URL = "http://localhost:8000";

const AdvertiserProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const [website, setWebsite] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      setErrorMessage("Username not found. Please log in or register.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.patch(
          `${API_URL}/readAdvertiserInfo`, 
          { Username: username }  // Sending the Username in the request body
        );

        // Check if the returned data is an array and access the first element
        if (Array.isArray(data) && data.length > 0) {
          const advertiser = data[0]; // Assuming the first element holds the correct profile data
          setProfile(advertiser);
          setStatus(advertiser.status || "");
          setWebsite(advertiser.website || "");
          setHotline(advertiser.hotline || "");
          setCompanyProfile(advertiser.companyProfile || "");
        } else {
          setErrorMessage("Advertiser not found.");
        }

        setErrorMessage(""); // Clear any existing error messages
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setErrorMessage(
          error.response?.data?.message || "An error occurred while fetching the profile."
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
        `${API_URL}/updateAdvertiserInfo`,
        Object.fromEntries(formData)
      );
      setProfile(data.advertiser);
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
         <br></br>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
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
                    value={profile?.Username || ""}
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
                    value={profile?.Email || ""}
                    disabled={true}
                    required
                  />
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="Website">Website</Label>
                  <Input
                    id="Website"
                    name="Website"
                    value={website}  // Use 'value' instead of 'defaultValue'
                    disabled={!isEditing}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                  />
                </div>

                {/* Hotline */}
                <div>
                  <Label htmlFor="Hotline">Hotline</Label>
                  <Input
                    id="Hotline"
                    name="Hotline"
                    value={hotline}  // Use 'value' instead of 'defaultValue'
                    disabled={!isEditing}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                  />
                </div>

                {/* Company Profile */}
                <div>
                  <Label htmlFor="CompanyProfile">Company Profile</Label>
                  <Input
                    id="CompanyProfile"
                    name="CompanyProfile"
                    value={companyProfile}  // Use 'value' instead of 'defaultValue'
                    disabled={!isEditing}
                    onChange={(e) => setCompanyProfile(e.target.value)}
                    required
                  />
                </div>

                {/* Status Badge */}
                <div className="flex items-center">
                  <Label>Status</Label>
                  <Badge className="ml-2">
                    <Star className="mr-1 h-3 w-3" />
                    {status ? status : "Loading..."} {/* Displaying Status */}
                  </Badge>
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

export default AdvertiserProfileManager;
