import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
export default function CreateTransportationDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    startPlace: "",
    price: "",
    vehicleType: "",
    availability: true,
    discount: 0,
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (value) => {
    setFormData((prev) => ({ ...prev, discount: value }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, availability: checked }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, vehicleType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const response = await axios.post(
        "http://localhost:8000/addTransportation",
        {
          destination: formData.destination,
          startPlace: formData.startPlace,
          price: formData.price,
          vehicleType: formData.vehicleType,
          availability: formData.availability,
          discount: formData.discount,
          advertiserID: userID,
          date: formData.date,
        }
      );

      if (response.status === 200) {
        setFormData({
          destination: "",
          startPlace: "",
          price: "",
          vehicleType: "",
          availability: true,
          discount: 0,
          date: "",
        });
        toast.success("Added successfully");
        setOpen(false);
      } else {
        toast.error("Error adding transportation.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add transportation: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Transportation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]" size="lg">
        <Toaster/>
        <DialogHeader>
          <DialogTitle>Create New Transportation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startPlace">Start Place</Label>
              <Input
                id="startPlace"
                name="startPlace"
                value={formData.startPlace}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.vehicleType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent portal={false}>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Boat">Boat</SelectItem>
                  <SelectItem value="Helicopter">Helicopter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <div className="flex items-center gap-2">
                <input
                  id="discount-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="slider"
                />
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-16"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                className="rounded-md border w-full"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                id="availability"
                type="checkbox"
                checked={formData.availability}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: e.target.checked,
                  }))
                }
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "20px",
                  backgroundColor: formData.availability ? "#826AF9" : "#ccc",
                  borderRadius: "10px",
                  position: "relative",
                  transition: "background-color 0.3s",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    height: "16px",
                    width: "16px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    top: "2px",
                    left: formData.availability ? "22px" : "2px",
                    transition: "left 0.3s",
                  }}
                />
              </span>
            </label>
            <Label
              htmlFor="availability"
              className="text-base text-muted-foreground font-normal"
            >
              Available
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Create Transportation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
