import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Icon } from "@iconify/react"
import { toast, Toaster } from "react-hot-toast"
import BasicMap from "./ui/basic-map"

const AddTourGuideItineraryModel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    Creator:"",
    Name: "",
    Activities: [],
    LocationsToVisit: [],
    TimeLine: "",
    Language: "",
    Price: "",
    AvailableDates: [],
    PickUpLocation: {
        type: "Point",
        coordinates: [0, 0],
      },
    DropOffLocation: {
        type: "Point",
        coordinates: [0, 0],
      },
  })
  const [activities, setActivities] = useState([])
  const [locations, setLocations] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [currentDate, setCurrentDate] = useState(""); 
  const [errors, setErrors] = useState({});



  useEffect(() => {
    fetchCreatorId()
    fetchActivities()
    fetchLocations()
  }, [])

  const fetchCreatorId = async () => {
    try {
      const username = sessionStorage.getItem("username")
      if (!username) {
        toast.error("Please log in to add activities.")
        return
      }

      const response = await fetch(`http://localhost:8000/getID/${username}`)
      if (!response.ok) throw new Error("Failed to fetch user ID")

      const { userID } = await response.json()
      setFormData((prev) => ({ ...prev, Creator: userID }))
    } catch (error) {
      console.error("Error fetching creator ID:", error)
      toast.error("Failed to retrieve user information. Please try logging in again.")
    }
  }
  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await fetch("http://localhost:8000/viewActivities")
      if (!response.ok) throw new Error("Failed to fetch activities")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast.error("Could not load activities. Please try again later.")
    } finally {
      setLoadingActivities(false)
    }
  }

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true)
      const response = await fetch("http://localhost:8000/readPlaces")
      if (!response.ok) throw new Error("Failed to fetch locations")
      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast.error("Could not load locations. Please try again later.")
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddDate = () => {
    if (currentDate && !formData.AvailableDates.includes(currentDate)) {
      setFormData((prev) => ({
        ...prev,
        AvailableDates: [...prev.AvailableDates, currentDate],
      }));
      setCurrentDate(""); // Reset the input
    }
  };
  
  const handleRemoveDate = (index) => {
    setFormData((prev) => ({
      ...prev,
      AvailableDates: prev.AvailableDates.filter((_, i) => i !== index),
    }));
  };
  
  const handleActivityChange = (ActivityId) => {
    setFormData((prev) => ({
      ...prev,
      Activities: prev.Activities.includes(ActivityId)
        ? prev.Activities.filter((id) => id !== ActivityId)
        : [...prev.Activities, ActivityId],
    }))
  }
  const handleLocationChange = (LocationId) => {
    setFormData((prev) => ({
      ...prev,
      LocationsToVisit: prev.LocationsToVisit.includes(LocationId)
        ? prev.LocationsToVisit.filter((id) => id !== LocationId)
        : [...prev.LocationsToVisit, LocationId],
    }))
  }
  const handleLocationSelect = (lng, lag) => {
    setFormData((prev) => ({
      ...prev,
      PickUpLocation: {
        type: "Point",
        coordinates: [lng, lag],
      },
    }))
  }
  const handleLocationSelect2 = (lng, lat) => {
    setFormData((prev) => ({
      ...prev,
      DropOffLocation: {
        type: "Point",
        coordinates: [lng, lat],
      },
    }))
  }
  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.Name.trim()) newErrors.Name = "Itinerary Name is required.";
    if (formData.Activities.length === 0) newErrors.Activities = "At least one activity must be selected.";
    if (formData.LocationsToVisit.length === 0) newErrors.LocationsToVisit = "At least one location must be selected.";
    if (!formData.TimeLine.trim()) newErrors.TimeLine = "Timeline is required.";
    if (!formData.Language.trim()) newErrors.Language = "Language is required.";
    if (!formData.Price.trim()) newErrors.Price = "Price is required.";
    if (formData.AvailableDates.length === 0) newErrors.AvailableDates = "At least one date must be added.";

  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
        toast.error("Please fill in all required fields.");
        return;
      }

    try {
        console.log(formData.PickUpLocation)
        console.log(formData.DropOffLocation)
      const response = await fetch("http://localhost:8000/createItinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Itinerary created successfully")
        setFormData({
          Creator:formData.Creator,
          Name: "",
          Activities: [],
          LocationsToVisit: [],
          TimeLine: "",
          Language: "",
          Price: "",
          AvailableDates: [],
          PickUpLocation: formData.PickUpLocation,
          DropOffLocation: formData.DropOffLocation
        })
        setIsOpen(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error creating itinerary")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to create itinerary")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Itinerary</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto" size="full">
        <Toaster />
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0 z-10"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="Name">Itinerary Name:</Label>
                <Input
                  id="Name"
                  name="Name"
                  placeholder="Itinerary Name"
                  required
                  value={formData.Name}
                  onChange={handleInputChange}
                />
                {errors.Name && <p className="text-red-500 text-sm">{errors.Name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Activities:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {loadingActivities ? (
                    <p>Loading activities...</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`activity_${activity._id}`}
                          name = "activities"
                          checked={formData.Activities.includes(activity._id)}
                          onChange={() => handleActivityChange(activity._id)}
                        />
                        <label htmlFor={`activity_${activity._id}`}>{activity.Name}</label>
                      </div>
                    ))
                  )}
                </div>
                {errors.Activities && <p className="text-red-500 text-sm">{errors.Activities}</p>}
              </div>

              <div className="space-y-2">
                <Label>Locations to Visit:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {loadingLocations ? (
                    <p>Loading locations...</p>
                  ) : (
                    locations.map((location) => (
                      <div key={location._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`location_${location._id}`}
                          checked={formData.LocationsToVisit.includes(location._id)}
                          onChange={() => handleLocationChange(location._id)}
                        />
                        <label htmlFor={`location_${location._id}`}>{location.Name}</label>
                      </div>
                    ))
                  )}
                </div>
                {errors.LocationsToVisit && (
    <p className="text-red-500 text-sm">{errors.LocationsToVisit}</p>
  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="TimeLine">Timeline:</Label>
                <Input
                  id="TimeLine"
                  name="TimeLine"
                  placeholder="Timeline"
                  required
                  value={formData.TimeLine}
                  onChange={handleInputChange}
                />
                {errors.TimeLine && <p className="text-red-500 text-sm">{errors.TimeLine}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Language">Language:</Label>
                <Input
                  id="Language"
                  name="Language"
                  placeholder="Language"
                  required
                  value={formData.Language}
                  onChange={handleInputChange}
                />
                {errors.Language && <p className="text-red-500 text-sm">{errors.Language}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Price">Price:</Label>
                <Input
                  id="Price"
                  name="Price"
                  placeholder="Price"
                  type="number"
                  required
                  value={formData.Price}
                  onChange={handleInputChange}
                />
                {errors.Price && <p className="text-red-500 text-sm">{errors.Price}</p>}
              </div>

              <div className="space-y-2">
                <Label>Available Dates:</Label>
                <div className="flex items-center space-x-2">
                    <Input
                    id="Date"
                    name="Date"
                    type="date"
                    value={currentDate} // Local state for the current date input
                    onChange={(e) => setCurrentDate(e.target.value)}
                    />
                    <button
                    type="button"
                    onClick={handleAddDate}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                    Add Date
                    </button>
                </div>
                {errors.AvailableDates && (
                <p className="text-red-500 text-sm">{errors.AvailableDates}</p>
                )}
                <ul className="list-disc list-inside mt-2">
                    {formData.AvailableDates.map((date, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{date}</span>
                        <button
                        type="button"
                        onClick={() => handleRemoveDate(index)}
                        className="text-red-500 hover:underline"
                        >
                        Remove
                        </button>
                    </li>
                    ))}
                </ul>
              </div>


              <div className="flex space-x-4">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="PickUpLocation">Pick-up Location:</Label>
                    <BasicMap onLocationSelect={handleLocationSelect}  />
                </div>

                <div className="space-y-2 flex-1">
                    <Label htmlFor="DropOffLocation">Drop-off Location:</Label>
                    <BasicMap onLocationSelect={handleLocationSelect2} />
                </div>
              </div>


              <Button type="submit" className="w-full">
                Create Itinerary
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddTourGuideItineraryModel

