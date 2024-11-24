import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const API_URL = "http://localhost:8000";

const TourGuideProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [previousWork, setPreviousWork] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          const { data } = await axios.get(`${API_URL}/readProfileInformation/${encodeURIComponent(username)}`);
      
          let pictureUrl = null;
          if (data.picture && data.picture.data) {
            const base64String = btoa(
              new Uint8Array(data.picture.data).reduce(
                (acc, byte) => acc + String.fromCharCode(byte),
                ''
              )
            );
            pictureUrl = `data:image/jpeg;base64,${base64String}`;
          }
      
          setProfile(data);
          setPreviousWork(data.PreviousWork || '');
          setYearsOfExperience(data.YearsOfExperience || '');
          setProfilePicture(pictureUrl);
          setErrorMessage('');
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setErrorMessage(error.response?.data?.message || 'An error occurred while fetching the profile.');
        }
      };
      
    fetchProfile();
  }, [username]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append("Username", username);
    formData.append("PreviousWork", previousWork);
    formData.append("YearsOfExperience", yearsOfExperience);

    try {
      const { data } = await axios.put(`${API_URL}/updateProfileInformation`, Object.fromEntries(formData));
      setProfile(data.tourGuide);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${API_URL}/changePasswordTourGuide`, {
        id: profile._id,
        oldPassword: event.target.elements.oldPassword.value,
        newPassword,
      });
      alert("Password changed successfully");
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Show preview of selected image
      const formData = new FormData();
      formData.append('image', file);
  
      try {
        await axios.put(`${API_URL}/uploadPicturetourguide/${profile._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Profile picture uploaded successfully');
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
      }
    }
  };
  

  const handleAccountDeletion = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/requestTourGuideAccountDeletion/${profile._id}`);
        alert("Account deletion requested successfully");
      } catch (error) {
        console.error("Failed to request account deletion:", error);
        alert("Failed to request account deletion. Please try again.");
      }
    }
  };

  if (errorMessage) {
    return <div style={{ color: 'red' }}>{errorMessage}</div>;
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
  {profilePicture && (
    <img
      src={profilePicture || "default-profile.png"}
      alt="Profile"
      className="w-20 h-20 rounded-full object-cover"
    />
  )}
  {isEditing && (
    <label className="flex items-center gap-2 cursor-pointer">
      <Button variant="outline">Upload</Button>
      <input
        type="file"
        accept="image/*"
        onChange={handlePictureUpload}
        hidden
      />
    </label>
  )}
</div>

            </div>

            {/* Name */}
            <div>
              <Label htmlFor="Name">Name</Label>
              <Input
                id="Name"
                name="Name"
                defaultValue={profile?.FullName || ''}
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
                defaultValue={profile?.Username || ''}
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
                defaultValue={profile?.Email || ''}
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
                defaultValue={profile?.MobileNumber || ''}
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
                value={previousWork}
                onChange={(e) => setPreviousWork(e.target.value)}
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
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
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
        </TabsContent>

        {/* Change Password Tab */}
        <TabsContent value="password">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input id="oldPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </TabsContent>
      </Tabs>

      {/* Account Deletion */}
      <Button variant="destructive" onClick={handleAccountDeletion}>
        Request Account Deletion
      </Button>
    </div>
  );
};

export default TourGuideProfileManager;
