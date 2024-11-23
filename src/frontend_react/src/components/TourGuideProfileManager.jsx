import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, X, Upload } from 'lucide-react';

const API_URL = "http://localhost:8000";

const TourGuideProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/readProfileInformation/${username}`);
        setProfile(data);
        setSkills(data.Skills || []);
        setProfilePicture(data.ProfilePicture || null); // Fetch profile picture
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [username]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("Username", username);
    formData.append("Skills", JSON.stringify(skills));
    try {
      const { data } = await axios.put(`${API_URL}/updateProfileInformation`, Object.fromEntries(formData));
      setProfile(data.tourGuide);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
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
      setProfilePicture(URL.createObjectURL(file)); // Preview the image
      const formData = new FormData();
      formData.append("image", file);
      try {
        await axios.put(`${API_URL}/uploadPicturetourguide/${profile._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Profile picture uploaded successfully");
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
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
                    src={profilePicture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                {isEditing && (
                  <Button as="label" variant="outline" className="flex items-center gap-2">
                    <Upload size={16} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureUpload}
                      hidden
                    />
                  </Button>
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

            {/* Skills */}
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} className="flex items-center gap-2">
                    {skill}
                    {isEditing && (
                      <X
                        className="cursor-pointer"
                        onClick={() => setSkills(skills.filter((s) => s !== skill))}
                      />
                    )}
                  </Badge>
                ))}
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => {
                      const skill = prompt("Add a skill");
                      if (skill) setSkills([...skills, skill]);
                    }}
                  >
                    <Plus /> Add Skill
                  </Button>
                )}
              </div>
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
