import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import axios from "axios";
import { Label } from "./ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomPopover as Popover } from "./ui/popover";
import { toast, Toaster } from "react-hot-toast";
import Car from "../public/images/car.png";
import Bus from "../public/images/bus.png";
import Boat from "../public/images/boat.png";
import Helicopter from "../public/images/helicopter.png";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const EditableTransportationCard = ({
  transportationId,
  destination,
  startPlace,
  price,
  vehicleType,
  availability,
  discount,
  ratings = 0,
  date,
  advertiserId,
  quantity = 3,
}) => {
  const [count, setCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advertiser, setAdvertiser] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransportation, setEditedTransportation] = useState({
    destination,
    startPlace,
    price,
    vehicleType,
    availability,
    discount,
    date,
    quantity,
  });

  const isAvailable = () => {
    if (availability) {
      return true;
    } else {
      return false;
    }
  };

  const goToBookings = () => {
    navigate("/bookings");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const openParam = searchParams.get("open");
    const transportationParam = searchParams.get("transportation");

    if (openParam === "true" && transportationParam === transportationId) {
      setIsModalOpen(true);
      fetchAdvertiserInfo();
    }
  }, [location, transportationId]);





  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "Car":
        return "mdi:car";
      case "Bus":
        return "mdi:bus";
      case "Boat":
        return "mdi:boat";
      case "Helicopter":
        return "mdi:helicopter";
      default:
        return "mdi:car";
    }
  };

  const fetchAdvertiserInfo = async () => {
    try {
      console.log(advertiserId);
      const response = await axios.get(
        `http://localhost:8000/getAdvertiserById/${advertiserId}`
      );
      setAdvertiser(response.data.advertiser);
    } catch (error) {
      console.error("Error fetching advertiser information:", error);
    }
  };

  const handleOpenChange = (open) => {
    setIsModalOpen(open);
    if (open) {
      fetchAdvertiserInfo();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("open");
      url.searchParams.delete("transportation");
      window.history.replaceState({}, "", url);
    }
  };

  const handleShare = (method) => {
    const currentUrl = window.location;
    const shareUrl = `${currentUrl}?open=true&transportation=${transportationId}`;
    const shareText = `Check out this amazing Transportation!`;

    if (method === "link") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast("Link copied to Clipboard!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setIsShareOpen(false);
      });
    } else if (method === "email") {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        shareText
      )}&body=${encodeURIComponent(shareUrl)}`;
      window.location.href = mailtoLink;
      setIsShareOpen(false);
    }
  };

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
      const base64String =
        typeof picture.data === "string"
          ? picture.data
          : btoa(String.fromCharCode.apply(null, new Uint8Array(picture.data)));
      return `data:${picture.contentType};base64,${base64String}`;
    }
    return null;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
    
      setIsEditing(false);
      toast.success("Transportation details updated successfully!");
    } catch (error) {
      console.error("Error updating transportation details:", error);
      toast.error("Failed to update transportation details");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransportation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setEditedTransportation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditedTransportation((prev) => ({ ...prev, date }));
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Card className="p-4 rounded-md cursor-pointer">
            <div className="relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
              <div
                className="w-full overflow-hidden rounded-md relative z-10 bg-default-100 dark:bg-default-200 h-full group"
                style={{ left: "0%", top: "0%" }}
              >
                <img
                  src={
                    vehicleType === "Car"
                      ? Car
                      : vehicleType === "Bus"
                      ? Bus
                      : vehicleType === "Boat"
                      ? Boat
                      : Helicopter
                  }
                  alt={`${vehicleType} to ${destination}`}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <Badge
                    color="destructive"
                    className="absolute top-3 ltr:left-3 rtl:right-3"
                  >
                    -{discount}%
                  </Badge>
                )}
                <div className="hover-box flex flex-col invisible absolute top-3 right-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 space-y-[6px]">
                  <button
                    className="rounded-full bg-background p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                  >
                    <Icon
                      icon={isLiked ? "ph:heart-fill" : "ph:heart"}
                      className={`h-4 w-4 ${
                        isLiked ? "text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-base mb-2">{destination}</p>
                <span className="flex items-center text-secondary-foreground font-normal text-xs gap-x-1">
                  <Icon icon="ph:star-fill" className="text-yellow-400" />
                  <span>{ratings}</span>
                </span>
              </div>

              <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
                From: {startPlace}
              </p>

              <div className="flex items-center justify-between mb-4">
                <p className="space-x-4">
                  <span className="text-secondary-foreground text-base font-medium">
                    {discount > 0 ? price - (price * discount) / 100 : price}
                  </span>
                  {discount > 0 && (
                    <del className="text-default-500 dark:text-default-500 font-normal text-base">
                      {price}
                    </del>
                  )}
                </p>
                <p
                  className={`text-sm ${
                    availability ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {availability ? "Available" : "Not Available"}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center text-secondary-foreground font-normal text-sm gap-x-1">
                  <Icon
                    icon={getVehicleIcon(vehicleType)}
                    className="w-5 h-5"
                  />
                  <span>{vehicleType}</span>
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Icon icon="ph:info" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                Show More Details
              </Button>
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          size="full"
        >
          <Toaster />
          <div className="relative">
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onClick={() => handleOpenChange(false)}
            >
              <Icon icon="ph:x" className="h-4 w-4" />
            </Button>
            <div className="space-y-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={
                      editedTransportation.vehicleType === "Car"
                        ? Car
                        : editedTransportation.vehicleType === "Bus"
                        ? Bus
                        : editedTransportation.vehicleType === "Boat"
                        ? Boat
                        : Helicopter
                    }
                    alt={`${editedTransportation.vehicleType} to ${editedTransportation.destination}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          name="destination"
                          value={editedTransportation.destination}
                          onChange={handleInputChange}
                          placeholder="Destination"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startPlace">Start Place</Label>
                        <Input
                          id="startPlace"
                          name="startPlace"
                          value={editedTransportation.startPlace}
                          onChange={handleInputChange}
                          placeholder="Start Place"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={editedTransportation.price}
                          onChange={handleInputChange}
                          placeholder="Price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <Select
                          name="vehicleType"
                          value={editedTransportation.vehicleType}
                          onValueChange={(value) =>
                            handleSelectChange("vehicleType", value)
                          }
                        >
                          <SelectTrigger id="vehicleType">
                            <SelectValue placeholder="Vehicle Type" />
                          </SelectTrigger>
                          <SelectContent portal={false}>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Boat">Boat</SelectItem>
                            <SelectItem value="Helicopter">
                              Helicopter
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                            checked={editedTransportation.availability}
                            onChange={(e) =>
                              setEditedTransportation((prev) => ({
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
                              backgroundColor: editedTransportation.availability
                                ? "#826AF9"
                                : "#ccc",
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
                                left: editedTransportation.availability
                                  ? "22px"
                                  : "2px",
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
                      <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={editedTransportation.discount}
                          onChange={handleInputChange}
                          placeholder="Discount (%)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <DatePicker
                          id="date"
                          selected={new Date(editedTransportation.date)}
                          onChange={handleDateChange}
                        />
                      </div>
                      
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {editedTransportation.vehicleType} to{" "}
                          {editedTransportation.destination}
                        </h1>

                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              icon="ph:star-fill"
                              className={`w-5 h-5 ${
                                i < Math.floor(ratings)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({ratings})
                          </span>
                        </div>

                        <div className="mb-6">
                          <span className="text-3xl font-bold text-primary">
                            ${editedTransportation.price}
                          </span>
                          {editedTransportation.discount > 0 && (
                            <>
                              <span className="ml-2 text-lg line-through text-gray-500">
                                $
                                {(
                                  editedTransportation.price +
                                  (editedTransportation.price *
                                    editedTransportation.discount) /
                                    100
                                ).toFixed(2)}
                              </span>
                              <span className="ml-2 text-lg font-semibold text-green-600">
                                {editedTransportation.discount}% Off
                              </span>
                            </>
                          )}
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Availability:</span>{" "}
                            <span
                              className={`text-sm ${
                                editedTransportation.availability
                                  ? "text-green-500"
                                  : "text-red-500 font-semibold"
                              }`}
                            >
                              {editedTransportation.availability
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">From:</span>{" "}
                            {editedTransportation.startPlace}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(
                              editedTransportation.date
                            ).toLocaleDateString()}
                          </p>
                          
                        </div>

                        <div className="flex space-x-4 mb-6">
                          {/* <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleEdit}
                          >
                            <Icon
                              icon="heroicons:pencil"
                              className="w-4 h-4 ltr:mr-2 rtl:ml-2"
                            />
                            Edit Transportation
                          </Button> */}
                          <Popover
                            open={isShareOpen}
                            onOpenChange={setIsShareOpen}
                            onClose={() => setIsShareOpen(false)}
                            trigger={
                              <Button
                                variant="outline"
                                onClick={() => setIsShareOpen(true)}
                              >
                                <Icon
                                  icon="heroicons:share"
                                  className="w-4 h-4 mr-2"
                                />
                                Share
                              </Button>
                            }
                          >
                            <div className="w-48 p-2">
                              <div className="flex flex-col space-y-2">
                                <Button
                                  variant="ghost"
                                  onClick={() => handleShare("link")}
                                  className="w-full justify-start"
                                >
                                  <Icon
                                    icon="heroicons:link"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Copy Link
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleShare("email")}
                                  className="w-full justify-start"
                                >
                                  <Icon
                                    icon="heroicons:envelope"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Email
                                </Button>
                              </div>
                            </div>
                          </Popover>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="info">
                    Transportation Information
                  </TabsTrigger>
                  <TabsTrigger value="advertiser">Advertiser</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">
                        Travel from {editedTransportation.startPlace} to{" "}
                        {editedTransportation.destination} via{" "}
                        {editedTransportation.vehicleType}. Enjoy a comfortable
                        and safe journey on{" "}
                        {new Date(
                          editedTransportation.date
                        ).toLocaleDateString()}
                        .
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="advertiser" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {advertiser ? (
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getImageSrc(advertiser.picture)}
                              alt={advertiser.FullName}
                            />
                            <AvatarFallback>
                              {advertiser.FullName
                                ? advertiser.FullName.charAt(0)
                                : advertiser.Username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {advertiser.FullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Email: {advertiser.Email}
                            </p>
                            {advertiser.Website && (
                              <p className="text-sm text-gray-600">
                                Website: {advertiser.Website}
                              </p>
                            )}
                            {advertiser.Hotline && (
                              <p className="text-sm text-gray-600">
                                Hotline: {advertiser.Hotline}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          Loading advertiser information...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableTransportationCard;
