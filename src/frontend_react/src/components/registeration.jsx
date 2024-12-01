"use client";
import React, { useState } from "react";
import "../assets/scss/partials/extra/_scrollbar.scss";
import { Stepper, Step, StepLabel } from "./ui/steps";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Label } from "../components/ui/label";
import { toast as reToast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";
import { Toaster } from "react-hot-toast";
import { useMediaQuery } from "../hooks/use-media-query";
import { useNavigate } from "react-router-dom";
import NationalitySelect from "./nationsSelect";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import UserPhoto from "./userPhoto";

const Registration = () => {
  const [activestep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(""); // State for tracking selected role in Step 1
  const [birthdate, setBirthdate] = useState(null);
  const [accepted, setAccepeted] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const handleImageSelect = (file) => {
    setProfileImage(file);
  };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    jobOrStudent: "",
    username: "",
    password: "",
    nationality: "",
  });

  const navigate = useNavigate();

  const steps = [
    {
      label: "step 1",
      desc: "Your Role",
    },
    {
      label: "step 2",
      desc: "Personal Information",
    },
    {
      label: "step 3",
      desc: "Username & Password",
    },
  ];

  const sendProfileImage = async (userID) => {
    let URL = "http://localhost:8000/";

    // Use formData.user to determine the correct URL
    switch (selectedRole) {
      case "Advertiser":
        URL += `uploadPictureadvertiser/${userID}`;
        break;
      case "Seller":
        URL += `uploadPictureseller/${userID}`;
        break;
      case "Tour Guide":
        URL += `uploadPicturetourguide/${userID}`;
        break;
      default:
        URL = ""; // Handle case where no role is selected
        break;
    }
    try {
      const dataToSend = new FormData();
      dataToSend.append("image", profileImage);
      await axios.put(URL, dataToSend);
    } catch (error) {
      throw new Error("Couldn't upload image");
    }
  };

  const sendRegisterationRequest = async (data) => {
    let URL = "http://localhost:8000/";

    // Use formData.user to determine the correct URL
    switch (selectedRole) {
      case "Advertiser":
        URL += "createAdvertiser";
        sessionStorage.setItem("Type", "Advertiser");
        break;
      case "Tourist":
        URL += "touristRegister";
        sessionStorage.setItem("Type", "Tourist");
        sessionStorage.setItem("curr", "USD");

        break;
      case "Seller":
        URL += "createSeller";
        sessionStorage.setItem("Type", "Seller");

        break;
      case "Tour Guide":
        URL += "createTourGuide";
        sessionStorage.setItem("Type", "TourGuide");

        break;
      default:
        URL = ""; // Handle case where no role is selected
        break;
    }

    try {
      const response = await axios.post(URL, data);
      if (response.status === 200) {
        sessionStorage.setItem("username", response.data.Username);
        if (profileImage) {
          await sendProfileImage(response.data._id);
        }
        toast({
          title: "Registration successful!",
          description: "You have successfully registered.",
        });
        if (selectedRole === "Tourist") {
          navigate("/TouristHomePage");
        } else {
          navigate("/uploadDocs");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message); // Display the error message returned from the catch block
    }
  };

  const handleNationalityChange = (selectedOption) => {
    setFormData({
      ...formData,
      nationality: selectedOption ? selectedOption.value : "", // Update nationality
    });
  };

  const handleNext = () => {
    // Basic validation before proceeding to the next step
    if (!validateCurrentStep()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const [errors, setErrors] = useState({});

  const validateCurrentStep = () => {
    let newErrors = {};

    if (activestep === 0) {
      if (!selectedRole) {
        newErrors.selectedRole = "Please select a role.";
      }
    } else if (activestep === 1) {
      const { fullName, email, mobileNumber, jobOrStudent, nationality } =
        formData;
      if (selectedRole === "Tourist") {
        if (!fullName) newErrors.fullName = "Full Name is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!mobileNumber)
          newErrors.mobileNumber = "Mobile Number is required.";
        if (!jobOrStudent)
          newErrors.jobOrStudent = "Job or Student field is required.";
        if (!birthdate) newErrors.birthdate = "Birthdate is required.";
        if (!nationality) {
          newErrors.nationality = "Please select your nationality.";
        }
      } else if (
        ["Advertiser", "Seller", "Tour Guide"].includes(selectedRole)
      ) {
        if (!fullName) newErrors.fullName = "Full Name is required.";
        if (!email) newErrors.email = "Email is required.";
      }
    } else if (activestep === 2) {
      if (!formData.username) newErrors.username = "Username is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      if (!accepted)
        newErrors.accepted = "Please accept our terms & conditions to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      jobOrStudent: "",
      username: "",
      password: "",
    });
  };

  const onSubmit = async () => {
    if (!validateCurrentStep()) return;

    const dataToSend = {
      FullName: formData.fullName,
      Email: formData.email,
      MobileNumber: formData.mobileNumber,
      Role: formData.jobOrStudent,
      Username: formData.username,
      Password: formData.password,
      Nationality: formData.nationality,
      DOB: birthdate,
    };

    reToast.promise(
      sendRegisterationRequest(dataToSend), // The promise from your registration function
      {
        loading: "Registering...", // Loading state
        success: "Registration successful!", // Success message
        error: "Username already exists", // Error message
      }
    );
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="mt-4">
      <Toaster />
      <h2 className="text-lg text-default-800 font-semibold text-center mb-8">
        {steps[activestep] && steps[activestep].desc}
      </h2>
      <Stepper current={activestep} direction={isTablet && "vertical"}>
        {steps.map((label, index) => (
          <Step key={label.label}>
            <StepLabel>{label.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activestep === steps.length ? (
        <React.Fragment>
          <div className="mt-2 mb-2 font-semibold text-center">
            All steps completed - you&apos;re finished
          </div>
          <div className="flex pt-2">
            <div className="flex-1" />
            <Button
              size="xs"
              variant="outline"
              color="destructive"
              className="cursor-pointer"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form>
            <div className="col-span-12 mt-6 mb-4">
              {activestep === 0 && (
                <React.Fragment>
                  <div className="space-y-4">
                    {["Advertiser", "Seller", "Tourist", "Tour Guide"].map(
                      (role) => (
                        <Button
                          key={role}
                          className="w-full"
                          type="button"
                          variant={selectedRole === role ? "" : "outline"}
                          onClick={() => setSelectedRole(role)}
                        >
                          {role}
                        </Button>
                      )
                    )}
                  </div>
                </React.Fragment>
              )}
              {activestep === 1 && (
                <>
                  {selectedRole === "Tourist" && (
                    <div className="col-span-12 space-y-4 mb-4">
                      <div className="col-span-12 lg:col-span-6">
                        <Input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className={
                            errors.fullName ? "border-destructive" : ""
                          }
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Input
                          type="text"
                          placeholder="Mobile Number"
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobileNumber: e.target.value,
                            })
                          }
                          className={
                            errors.mobileNumber ? "border-destructive" : ""
                          }
                        />
                        {errors.mobileNumber && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.mobileNumber}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex space-x-4">
                        {" "}
                        {/* Added flex and spacing between items */}
                        <div className="flex-1 relative">
                          {" "}
                          {/* flex-1 allows DatePicker to take available space */}
                          <DatePicker
                            selected={birthdate}
                            onChange={(date) => setBirthdate(date)}
                            dateFormat="dd/MM/yyyy" // You can customize the date format
                            placeholderText="DD/MM/YYYY"
                            className={
                              errors.birthdate
                                ? "mt-1 block w-full border border-red-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 py-2 px-3"
                                : "mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 py-2 px-3"
                            } // Ensure width and padding
                          />
                          {errors.birthdate && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.birthdate}
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <NationalitySelect
                            onChange={handleNationalityChange}
                            error={errors.nationality}
                          />
                          {errors.nationality && (
                            <p className="text-sm text-destructive mt-2">
                              Please select your nationality.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Input
                          type="text"
                          placeholder="Job or Student"
                          className={
                            errors.jobOrStudent ? "border-destructive" : ""
                          }
                          value={formData.jobOrStudent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jobOrStudent: e.target.value,
                            })
                          }
                        />
                        {errors.jobOrStudent && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.jobOrStudent}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {["Advertiser", "Seller", "Tour Guide"].includes(
                    selectedRole
                  ) && (
                    <div className="col-span-12 space-y-4 mb-4">
                      <div className="flex flex-col items-center">
                        <Label className="mb-2 text-center" htmlFor="fullName">
                          Upload a photo
                        </Label>
                        <UserPhoto onImageSelect={handleImageSelect} />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="fullName">
                          Enter Full Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className={
                            errors.fullName ? "border-destructive" : ""
                          }
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="email">
                          Enter Email
                        </Label>
                        <Input
                          type="email"
                          placeholder="example@wandermate.com"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          className={errors.email ? "border-destructive" : ""}
                        />

                        {errors.email && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              {activestep === 2 && (
                <>
                  <div className="col-span-12 lg:col-span-6 mb-4">
                    <Label className="mb-2" htmlFor="username">
                      Enter Username
                    </Label>
                    <Input
                      type="text"
                      placeholder="Unique Username"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className={errors.username ? "border-destructive" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive mt-2">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div className="col-span-12 lg:col-span-6 mb-4">
                    <Label className="mb-2" htmlFor="password">
                      Enter Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-2">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap  gap-x-5 gap-y-4 ">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Label
                          htmlFor="terms"
                          className="text-sm text-default-600 cursor-pointer whitespace-nowrap underline"
                        >
                          Our Terms & Conditions
                        </Label>
                      </DialogTrigger>
                      <DialogContent className="overflow-y-auto max-h-[80vh] p-0">
                        <div className=" w-full">
                          <ScrollArea className="h-full p-5 ">
                            <h3 className="text-lg font-semibold text-default-950 dark:text-primary-foreground mt-5">
                              Terms and Conditions
                            </h3>
                            <div className="mt-4 space-y-6">
                              <p>
                                Welcome to our platform. By accessing or using
                                our services for flight booking, hotel booking,
                                purchasing products, booking activities, and
                                custom itineraries, you agree to comply with and
                                be bound by the following terms and conditions.
                              </p>
                              <p>
                                Our services are designed to offer convenience
                                and value by providing a variety of
                                travel-related bookings and products. Users are
                                responsible for ensuring the accuracy of all
                                booking details, including traveler information,
                                dates, and selections. Payments, cancellations,
                                and refunds are subject to our specific policies
                                outlined at checkout and in the confirmation
                                emails you receive.
                              </p>
                              <p>
                                Flight and hotel bookings are managed through
                                our partner networks, and availability is
                                subject to change. Please review all details
                                carefully, as changes or cancellations may incur
                                fees or restrictions according to each
                                provider’s policies.
                              </p>
                              <p>
                                For activity bookings and itineraries,
                                descriptions, schedules, and pricing are
                                provided based on the latest available
                                information but are subject to adjustments due
                                to local conditions or provider changes.
                              </p>
                              <p>
                                The purchase of products through our site is
                                subject to availability, delivery conditions,
                                and return policies. Please refer to our return
                                policy for guidelines on eligible returns.
                              </p>
                              <p>
                                By using this site, you acknowledge that our
                                liability is limited, and we are not responsible
                                for any damages, delays, or losses incurred due
                                to changes, cancellations, or interruptions in
                                service. We reserve the right to modify these
                                terms at any time. Continued use of our site
                                following any modifications signifies acceptance
                                of the updated terms.
                              </p>
                            </div>
                          </ScrollArea>
                        </div>
                        <DialogFooter className="px-5 py-3 pt-0 gap-2">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Close
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              type="submit"
                              className="underline"
                              onClick={() => setAccepeted(true)}
                            >
                              Accept
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* <input
                    type="checkbox"
                      size="sm"
                      className="border-default-300 mt-[1px]"
                      id="terms"
                    /> */}
                  </div>
                </>
              )}
              {errors.accepted && (
                <p className="text-sm text-destructive mt-2">
                  {errors.accepted}
                </p>
              )}
            </div>
          </form>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={activestep === 0}
            >
              Back
            </Button>
            <Button
              onClick={activestep === steps.length - 1 ? onSubmit : handleNext}
              disabled={!selectedRole}
            >
              {activestep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
          <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/loginPage")}
              className="text-primary"
              type="button"
            >
              Sign In
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Registration;
