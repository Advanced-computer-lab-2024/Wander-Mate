import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Icon } from "@iconify/react"
import { toast, Toaster } from "react-hot-toast"

const AddTourGuideItineraryModel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    Name: "",
    Activities: "",
    LocationsToVisit: "",
    TimeLine: "",
    Language: "",
    Price: "",
    AvailableDates: "",
    PickUpLocation: "",
    DropOffLocation: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
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
          Name: "",
          Activities: "",
          LocationsToVisit: "",
          TimeLine: "",
          Language: "",
          Price: "",
          AvailableDates: "",
          PickUpLocation: "",
          DropOffLocation: "",
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="Activities">Activities:</Label>
                <Textarea
                  id="Activities"
                  name="Activities"
                  placeholder="Activities"
                  required
                  value={formData.Activities}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="LocationsToVisit">Locations to Visit:</Label>
                <Textarea
                  id="LocationsToVisit"
                  name="LocationsToVisit"
                  placeholder="Locations to Visit"
                  required
                  value={formData.LocationsToVisit}
                  onChange={handleInputChange}
                />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="AvailableDates">Available Dates:</Label>
                <Input
                  id="AvailableDates"
                  name="AvailableDates"
                  placeholder="Available Dates"
                  required
                  value={formData.AvailableDates}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="PickUpLocation">Pick-up Location:</Label>
                <Input
                  id="PickUpLocation"
                  name="PickUpLocation"
                  placeholder="Pick-up Location"
                  required
                  value={formData.PickUpLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="DropOffLocation">Drop-off Location:</Label>
                <Input
                  id="DropOffLocation"
                  name="DropOffLocation"
                  placeholder="Drop-off Location"
                  required
                  value={formData.DropOffLocation}
                  onChange={handleInputChange}
                />
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

