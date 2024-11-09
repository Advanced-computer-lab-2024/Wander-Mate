import React, { useState, useEffect } from 'react';

export default function UpdateTouristProfile() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    nationality: '',
    role: '',
    walletBalance: '',
    badge: '',
    points: ''
  });
  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setFormData(prevData => ({ ...prevData, username: storedUsername }));
      loadNationalities(storedUsername);
    } else {
      alert("User not logged in. Please log in first.");
    }
  }, []);

  const fetchTouristDetails = async (username) => {
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();

      const response = await fetch(`http://localhost:8000/handleTourist/${userID}`);
      const tourist = await response.json();
      const formattedDOB = tourist.DOB.split("T")[0];

      setFormData({
        username: tourist.Username,
        fullName: tourist.FullName,
        email: tourist.Email,
        mobileNumber: tourist.MobileNumber,
        role: tourist.Role,
        dob: formattedDOB,
        walletBalance: tourist.Wallet,
        badge: tourist.Badge,
        points: tourist.Points,
        nationality: tourist.Nationality
      });
    } catch (error) {
      console.error("Error fetching tourist details:", error);
    }
  };

  const loadNationalities = async (username) => {
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();

      const response = await fetch("http://localhost:8000/getNations");
      const nationalitiesData = await response.json();
      setNationalities(nationalitiesData);

      fetchTouristDetails(username);
    } catch (error) {
      console.error("Error loading nationalities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const updateTourist = async (e) => {
    e.preventDefault();
    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${formData.username}`);
      if (!idResponse.ok) throw new Error("Failed to get user ID");
      const { userID } = await idResponse.json();
      if (!userID) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const updatedProfile = {
        FullName: formData.fullName,
        Email: formData.email,
        MobileNumber: formData.mobileNumber,
        Nationality: formData.nationality,
        Role: formData.role,
      };

      const response = await fetch(`http://localhost:8000/handleTourist/${userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();
      if (data.message === "Tourist updated successfully") {
        alert("Profile updated successfully.");
      } else {
        alert(`Error updating profile: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">Update My Profile</h1>
            </div>
            <form onSubmit={updateTourist} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    id="touristUserName"
                    name="username"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="touristUserName" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                </div>
                <div className="relative">
                  <input
                    id="touristFullName"
                    name="fullName"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="touristFullName" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Full Name</label>
                </div>
                <div className="relative">
                  <input
                    id="touristEmail"
                    name="email"
                    type="email"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="touristEmail" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                </div>
                <div className="relative">
                  <input
                    id="MobileNumber"
                    name="mobileNumber"
                    type="tel"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Phone number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="MobileNumber" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Phone number</label>
                </div>
                <div className="relative">
                  <input
                    id="touristDOB"
                    name="dob"
                    type="date"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    value={formData.dob}
                    onChange={handleInputChange}
                    readOnly
                  />
                  <label htmlFor="touristDOB" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Date of Birth</label>
                </div>
                <div className="relative">
                  <select
                    id="nationality"
                    name="nationality"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Nationality</option>
                    {nationalities.map((nation) => (
                      <option key={nation._id} value={nation._id}>
                        {nation.country_name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="nationality" className="absolute left-0 -top-3.5 text-gray-600 text-sm">Nationality</label>
                </div>
                <div className="relative">
                  <input
                    id="Role"
                    name="role"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Job"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="Role" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Job</label>
                </div>
                <div className="relative">
                  <input
                    id="walletBalance"
                    name="walletBalance"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    value={formData.walletBalance}
                    readOnly
                  />
                  <label htmlFor="walletBalance" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Wallet Balance</label>
                </div>
                <div className="relative">
                  <input
                    id="badge"
                    name="badge"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    value={formData.badge}
                    readOnly
                  />
                  <label htmlFor="badge" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">My badge</label>
                </div>
                <div className="relative">
                  <input
                    id="points"
                    name="points"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    value={formData.points}
                    readOnly
                  />
                  <label htmlFor="points" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">My Points</label>
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}