"use client";
import React, { useState } from "react";
import { Stepper, Step, StepLabel } from "./ui/steps";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Label } from "../components/ui/label";
import { ChevronDown } from "lucide-react"; // Example of specific icon import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "../lib/utils";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { faker } from "@faker-js/faker";
import { toast as reToast } from "react-hot-toast";

const Registration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(""); // State for tracking selected role in Step 1
  const [birthdate, setBirthdate] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]); // State for storing the uploaded PDFs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    jobOrStudent: '',
    username: '',
    password: ''
  });

  const steps = [
    {
      label: "step 1",
      desc: "Your Info",
    },
    {
      label: "step 2",
      desc: "Personal Information",
    },
    {
      label: "step 3",
      desc: "Email & Password",
    },
  ];

  const handleNext = () => {
    // Basic validation before proceeding to the next step
    if (!validateCurrentStep()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const validateCurrentStep = () => {
    // Check required fields based on the current step
    if (activeStep === 0) {
      return selectedRole !== ''; // Ensure a role is selected
    }
    if (activeStep === 1) {
      // Check all fields in Step 1 based on selected role
      const { fullName, email, mobileNumber, jobOrStudent } = formData;
      if (selectedRole === "Tourist") {
        return fullName && email && mobileNumber && jobOrStudent && birthdate;
      }
      if (["Advertiser", "Seller", "Tour Guide"].includes(selectedRole)) {
        return fullName && email && pdfFiles.length > 0; // At least one file should be uploaded
      }
    }
    if (activeStep === 2) {
      // Validate username and password
      return formData.username && formData.password;
    }
    return false;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setPdfFiles([]); // Reset the PDF files on reset
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      jobOrStudent: '',
      username: '',
      password: ''
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    const newFiles = files.filter((file) => file.type === "application/pdf"); // Filter to keep only PDF files
    setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]); // Add new files to the existing array
    event.target.value = ""; // Reset the input value to allow for the same file to be uploaded again
  };

  const handleRemoveFile = (fileToRemove) => {
    setPdfFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove)); // Remove the selected file
  };

  const onSubmit = () => {
    toast({
      title: "You submitted the following values:",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 top-0 right-0">
          <p className="text-primary-foreground">Done</p>
          <ul>
            {pdfFiles.map((file) => (
              <li key={file.name}>{file.name}</li> // List the names of uploaded files
            ))}
          </ul>
        </div>
      ),
    });
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="mt-4">
      <h2 className="text-lg text-default-800 font-semibold text-center mb-8">
        {steps[activeStep] && steps[activeStep].desc}
      </h2>
      <Stepper current={activeStep} direction={isTablet && "vertical"}>
        {steps.map((label, index) => (
          <Step key={label.label}>
            <StepLabel>{label.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
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
              {activeStep === 0 && (
                <React.Fragment>
                  <div className="space-y-4">
                    {["Advertiser", "Seller", "Tourist", "Tour Guide"].map((role) => (
                      <Button
                        key={role}
                        className="w-full"
                        type="button"
                        variant={selectedRole === role ? "" : "outline"}
                        onClick={() => setSelectedRole(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </React.Fragment>
              )}
              {activeStep === 1 && (
                <>
                  {selectedRole === "Tourist" && (
                    <div className="col-span-12 space-y-4 mb-4">
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="fullName">Enter Full Name</Label>
                        <Input 
                          type="text" 
                          placeholder="Full Name" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="email">Enter Email</Label>
                        <Input 
                          type="email" 
                          placeholder="Email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="mobileNumber">Enter Mobile Number</Label>
                        <Input 
                          type="text" 
                          placeholder="Mobile Number" 
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex space-x-4">
                        <div className="flex-1 relative">
                          <DatePicker
                            selected={birthdate}
                            onChange={(date) => setBirthdate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Select your birthdate"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 py-2 px-3"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="w-full" variant="outline">
                                Job / Student
                                <ChevronDown className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Job / Student</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {["Job", "Student"].map((option) => (
                                <DropdownMenuItem
                                  key={option}
                                  onClick={() => {
                                    setFormData({ ...formData, jobOrStudent: option });
                                  }}
                                >
                                  {option}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )}
                  {["Advertiser", "Seller", "Tour Guide"].includes(selectedRole) && (
                    <div className="col-span-12 space-y-4 mb-4">
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="fullName">Enter Full Name</Label>
                        <Input 
                          type="text" 
                          placeholder="Full Name" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label className="mb-2" htmlFor="email">Enter Email</Label>
                        <Input 
                          type="email" 
                          placeholder="Email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
  <Label className="mb-2">Upload PDFs</Label>
  <input
    type="file"
    accept="application/pdf"
    multiple
    onChange={handleFileChange}
    required
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
  />

  <ul className="mt-4 space-y-2">
    {pdfFiles.map((file) => (
      <li
        key={file.name}
        className="flex justify-between items-center bg-gray-100 rounded-md p-2 shadow-sm"
      >
        <span className="text-sm text-gray-800 truncate max-w-[70%]">{file.name}</span>
        <Button
          onClick={() => handleRemoveFile(file)}
          variant="outline"
          className="ml-2 px-3 py-1 text-sm"
        >
          Remove
        </Button>
      </li>
    ))}
  </ul>
</div>

                    </div>
                  )}
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="col-span-12 lg:col-span-6 mb-4">
                    <Label className="mb-2" htmlFor="username">Enter Username</Label>
                    <Input 
                      type="text" 
                      placeholder="Username" 
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 mb-4">
                    <Label className="mb-2" htmlFor="password">Enter Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </form>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Registration;
