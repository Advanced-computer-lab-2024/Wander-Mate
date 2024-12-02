import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../components/changePassword";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import CustomConfirmationDialog from "../components/ui/confirmationDialog";

const API_URL = "http://localhost:8000"

const AdvertiserProfileManager = () => {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [status, setStatus] = useState("")
  const [website, setWebsite] = useState("")
  const [hotline, setHotline] = useState("")
  const [companyProfile, setCompanyProfile] = useState("")
  const username = sessionStorage.getItem("username");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      setErrorMessage("Username not found. Please log in or register.")
      return
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.patch(`${API_URL}/readAdvertiserInfo`, { Username: username })

        if (Array.isArray(data) && data.length > 0) {
          const advertiser = data[0]
          setProfile(advertiser)
          setStatus(advertiser.status || "")
          setWebsite(advertiser.Website || "")
          setHotline(advertiser.Hotline || "")
          setCompanyProfile(advertiser.CompanyProfile || "")
        } else {
          setErrorMessage("Advertiser not found.")
        }

        setErrorMessage("")
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setErrorMessage(error.response?.data?.message || "An error occurred while fetching the profile.")
      }
    }

    fetchProfile()
  }, [username])

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    formData.append("Username", username)

    try {
      const { data } = await axios.put(`${API_URL}/updateAdvertiserInfo`, Object.fromEntries(formData))
      setProfile(data.advertiser)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }
  const handleDelete = () => {
    setIsConfirmationOpen(true);
  };
  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };
  const handleDeleteAccount = async () => {
    
  
    try {
      const { data } = await axios.delete(`${API_URL}/requestAdvertiserAccountDeletion/${profile._id}`);
      toast.success(data.message);
      // Optionally clear session and redirect
      sessionStorage.clear();
      navigate("/LoginPage");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting the account.");
    }
  };
  
  if (errorMessage) {
    return <div style={{ color: "red" }}>{errorMessage}</div>
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <br />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="campaigns">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <br />
                <div>
                  <Label htmlFor="Username">Username</Label>
                  <Input id="Username" name="Username" value={profile?.Username || ""} disabled={true} />
                </div>

                <div>
                  <Label htmlFor="Email">Email</Label>
                  <Input id="Email" name="Email" type="email" value={profile?.Email || ""} disabled={true} required />
                </div>

                <div>
                  <Label htmlFor="Website">Website</Label>
                  <Input
                    id="Website"
                    name="Website"
                    value={website}
                    disabled={!isEditing}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="Hotline">Hotline</Label>
                  <Input
                    id="Hotline"
                    name="Hotline"
                    value={hotline}
                    disabled={!isEditing}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="CompanyProfile">Company Profile</Label>
                  <Input
                    id="CompanyProfile"
                    name="CompanyProfile"
                    value={companyProfile}
                    disabled={!isEditing}
                    onChange={(e) => setCompanyProfile(e.target.value)}
                    required
                  />
                </div>

                {/* <div className="flex items-center">
                  <Label>Status</Label>
                  <Badge className="ml-2">
                    <Star className="mr-1 h-3 w-3" />
                    {status ? status : "Loading..."}
                  </Badge>
                </div> */}

                <div className="flex gap-4">
                  <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  {isEditing && <Button type="submit">Save Changes</Button>}
                  <Button type="button" color="destructive" onClick={handleDelete}>
                  Delete Account
                  </Button>
                  <CustomConfirmationDialog
                        isOpen={isConfirmationOpen}
                        onConfirm={handleDeleteAccount}
                        onCancel={handleCancelDelete}
                        message="Are you sure you want to delete this itinerary?"
                      />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
        <ChangePassword URL="http://localhost:8000/changePasswordAdvertiser"/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvertiserProfileManager
