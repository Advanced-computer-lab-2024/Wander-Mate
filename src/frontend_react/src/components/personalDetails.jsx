import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton"; // Importing Skeleton component
import { useState, useEffect } from "react";
import Select from "react-select";
import { format, parseISO } from "date-fns";
import axios from "axios";

const PersonalDetails = () => {
  const [userData, setUserData] = useState(null); // User data from backend
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [loading, setLoading] = useState(true); // Loading state
  const [currencies, setCurrencies] = useState([]); // Currency options
  const [nations, setNations] = useState([]); // Nationality options

  const [jobs] = useState([
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "other", label: "Other" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const userResponse = await fetch(
          `http://localhost:8000/handleTourist/${userID}`
        );
        const user = await userResponse.json();

        const exchangeResponse = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const exchangeData = await exchangeResponse.json();
        const currencyOptions = Object.keys(exchangeData.rates).map(
          (currency) => ({
            value: currency,
            label: currency,
          })
        );

        const nationResponse = await axios.get(
          "http://localhost:8000/getNations"
        );
        const nationOptions = nationResponse.data.map((nation) => ({
          value: nation._id,
          label: nation.country_name,
        }));

        setNations(
          nationOptions.sort((a, b) => a.label.localeCompare(b.label))
        );

        setUserData({
          ...user,
          selectedCurrency: currencyOptions.find(
            (option) => option.value === user.Currency
          ) || {
            value: "USD",
            label: "USD",
          },
          selectedJob: jobs.find((job) => job.value === user.Role),
          selectedNationality:
            nationOptions.find((nation) => nation.value === user.Nationality) ||
            null,
          DOB: user.DOB ? format(parseISO(user.DOB), "yyyy-MM-dd") : "",
        });
        setCurrencies(currencyOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [jobs]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...userData,
        Currency: userData.selectedCurrency.value,
        Nationality: userData.selectedNationality?.value || "",
      };

      const response = await axios.put(
        `http://localhost:8000/handleTourist/${updatedData._id}`,
        {
          FullName: updatedData.FullName,
          Email: updatedData.Email,
          MobileNumber: updatedData.MobileNumber,
          Currency: updatedData.Currency,
          Role: updatedData.Role,
          Nationality: updatedData.Nationality,
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.log("Error saving data:", response.data);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading || !userData) {
    return (
      <Card className="rounded-t-none pt-6">
        <CardContent className="p-0">
          <div className="w-full h-[191px] overflow-hidden rounded-t-md">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-4">
            <Skeleton className="w-full mb-2 h-3" />
            <Skeleton className="w-full h-3 mb-0.5" />
            <Skeleton className="w-full h-3 mb-0.5" />
            <Skeleton className="w-full h-3 mb-0.5" />
            <Skeleton className="w-full h-3 mb-0.5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-t-none pt-6">
      <CardContent>
        <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
          {/* Full Name */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="firstName" className="mb-2">
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="firstName"
                value={userData.FullName}
                onChange={(e) => handleChange("FullName", e.target.value)}
              />
            ) : (
              <div className="text-gray-800 bg-gray-100 p-2 rounded">
                {userData.FullName || "Not provided"}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="phoneNumber" className="mb-2">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                type="number"
                value={userData.MobileNumber}
                onChange={(e) => handleChange("MobileNumber", e.target.value)}
              />
            ) : (
              <div className="text-gray-800 bg-gray-100 p-2 rounded">
                {userData.MobileNumber || "Not provided"}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="email" className="mb-2">
              Email Address
            </Label>
            {isEditing ? (
              <Input
                id="email"
                value={userData.Email}
                onChange={(e) => handleChange("Email", e.target.value)}
              />
            ) : (
              <div className="text-gray-800 bg-gray-100 p-2 rounded">
                {userData.Email || "Not provided"}
              </div>
            )}
          </div>

          {/* Date of Birth (non-editable) */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="dob" className="mb-2">
              Date of Birth
            </Label>
            <div className="text-gray-800 bg-gray-100 p-2 rounded">
              {userData.DOB || "Not provided"}
            </div>
          </div>

          {/* Currency */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="currency" className="mb-2">
              Currency
            </Label>
            <Select
              placeholder="Select Currency"
              options={currencies}
              value={userData.selectedCurrency}
              onChange={(value) => handleChange("selectedCurrency", value)}
              isDisabled={!isEditing}
            />
          </div>

          {/* Nationality */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="nationality" className="mb-2">
              Nationality
            </Label>
            {isEditing ? (
              <Select
                placeholder="Select Nationality"
                options={nations}
                value={userData.selectedNationality}
                onChange={(value) => handleChange("selectedNationality", value)}
                isDisabled={!isEditing}
              />
            ) : (
              <div className="text-gray-800 bg-gray-100 p-2 rounded">
                {userData.selectedNationality?.label || "Not provided"}
              </div>
            )}
          </div>

          {/* Job */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="Role" className="mb-2">
              Job
            </Label>
            {isEditing ? (
              <Input
                id="Role"
                type="text"
                value={userData.Role}
                onChange={(e) => handleChange("Role", e.target.value)}
              />
            ) : (
              <div className="text-gray-800 bg-gray-100 p-2 rounded">
                {userData.Role || "Not provided"}
              </div>
            )}
          </div>

          {/* Save / Edit Button */}
          <div className="col-span-12 flex justify-between mt-5">
            {isEditing ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
