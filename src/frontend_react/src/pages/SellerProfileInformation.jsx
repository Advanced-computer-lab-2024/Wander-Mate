import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star } from "lucide-react";

const API_URL = "http://localhost:8000"

const SellerProfileManager = () => {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fullName, setFullName] = useState("")
  const [description, setDescription] = useState("")
  const username = sessionStorage.getItem("username")

  useEffect(() => {
    if (!username) {
      setErrorMessage("Username not found. Please log in or register.")
      return
    }

    const fetchProfile = async () => {
      try {
        // Pass the username as a query parameter
        const { data } = await axios.get(`${API_URL}/readSeller`, {
          params: { username }
        })

        if (Array.isArray(data) && data.length > 0) {
          const seller = data[0]
          setProfile(seller)
          setFullName(seller.FullName || "")
          setDescription(seller.Description || "")
        } else {
          setErrorMessage("Seller not found.")
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
      const { data } = await axios.put(`${API_URL}/updateSeller`, Object.fromEntries(formData))
      setProfile(data.seller)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (errorMessage) {
    return <div style={{ color: "red" }}>{errorMessage}</div>
  }

//   if (!profile) return <div>Loading...</div>

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
                  <Label htmlFor="FullName">Full Name</Label>
                  <Input
                    id="FullName"
                    name="FullName"
                    value={fullName}
                    disabled={!isEditing}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="Description">Description</Label>
                  <Input
                    id="Description"
                    name="Description"
                    value={description}
                    disabled={!isEditing}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  {isEditing && <Button type="submit">Save Changes</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          {/* <CampaignsTab /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SellerProfileManager;
