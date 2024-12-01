import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const ComplaintForm = () => {
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [touristID, setTouristID] = useState(null); // Store the touristID here
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Fetch the tourist ID on component mount
  useEffect(() => {
    fetchTouristID();
  }, []); // Run once when component mounts

  const fetchTouristID = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('No username found in session storage.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/getID/${username}`);
      if (!response.ok) throw new Error("Failed to fetch tourist ID");

      const { userID } = await response.json();
      setTouristID(userID);  // Set the tourist ID once fetched
    } catch (error) {
      console.error("Error fetching tourist ID:", error);
      setErrorMessage("Could not load tourist information.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !problem || !touristID) {
      setErrorMessage("Please fill in all fields and ensure you're logged in.");
      setSuccessMessage(''); // Clear any previous success message
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

     
      // Send the complaint request with touristID (ObjectId)
      const response =  axios.post('http://localhost:8000/makeComplaint', {
        Title: title,
        Body: problem,
        touristID,  // Pass the touristID (which should be the ObjectId)
        reply: { Body: "No reply yet", Date: Date.now() },
      });

      toast.promise(
        response,
        {
          loading: "Submitting Complaint...",
          success: "Complaint Submitted Successfully!",
          error: "Error submitting complaint.",
        },
        {
          // Optional settings for the toast (you can customize these)
          success: {
            duration: 4000, // The toast will disappear after 4 seconds
            icon: "✅",
          },
          error: {
            duration: 4000,
            icon: "❌",
          },
        }
      );
      try{

    const comp=await response;  
    } catch (error) {
      setErrorMessage("There was an issue submitting your complaint. Please try again later.");
      setSuccessMessage(''); // Clear any previous success message
    } finally {
      setIsSubmitting(false); // Set submitting state to false once the request is finished
    }
  };

  return (
    <>
    <Toaster/>
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>File a Complaint</CardTitle>
        <CardDescription>Please provide details about your complaint below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Brief title of your complaint" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem">Problem Description</Label>
            <Textarea 
              id="problem" 
              placeholder="Describe your complaint in detail" 
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </CardFooter>
      </form>

      {/* Success or Error message below the submit button */}
      {(successMessage || errorMessage) && (
        <div className="mt-4 text-center">
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      )}
    </Card>
    </>
  );
};

export default ComplaintForm;
