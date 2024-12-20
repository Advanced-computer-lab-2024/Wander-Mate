import React, { useState, useEffect } from "react";
import TransportationCard from "../components/transportCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Search, ArrowUpDown, CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import NavigationMenuBar from "../components/NavigationMenuBar";
import TransportaionTour from "../components/transportationsTour";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const Transportation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortCriteria, setSortCriteria] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [allTransportations, setAllTransportations] = useState([]);
  const [filteredTransportations, setFilteredTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");

  const fetchTransportations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/viewAllTransportations"
      );
      if (response.ok) {
        const transportations = await response.json();
        console.log("Fetched transportations:", transportations);
        setAllTransportations(transportations.transportations);
        setFilteredTransportations(transportations.transportations);
      } else {
        console.error("Failed to fetch transportations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching transportations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = () => {
    let updatedTransportations = allTransportations
      .filter(
        (transportation) =>
          (transportation.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            transportation.startPlace
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          transportation.price >= minPrice &&
          transportation.price <= maxPrice &&
          (selectedVehicleType === "All" ||
            transportation.vehicleType === selectedVehicleType) &&
          (!selectedDate ||
            new Date(transportation.date).toDateString() ===
              selectedDate.toDateString())
      )
      .sort((a, b) => {
        if (sortCriteria === "rating") {
          return sortOrder === "asc"
            ? a.ratings - b.ratings
            : b.ratings - a.ratings;
        }
        if (sortCriteria === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
    console.log("Filtered transportations:", updatedTransportations);
    setFilteredTransportations(updatedTransportations);
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const c = sessionStorage.getItem("curr");
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${c}`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
    fetchTransportations();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [
    searchTerm,
    minPrice,
    maxPrice,
    sortCriteria,
    sortOrder,
    selectedDate,
    selectedVehicleType,
    allTransportations,
  ]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (value) => setSortCriteria(value);
  const handleSortOrderToggle = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(value);
    setPriceRange([value, maxPrice]);
  };
  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    setPriceRange([minPrice, value]);
  };
  const handleDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setSelectedDate(date);
    handleFilterAndSort();
  };
  const handleVehicleTypeChange = (value) => setSelectedVehicleType(value);

  return (
    <>
      <NavigationMenuBar />
      <TransportaionTour>
        <div className="container mx-auto p-4" id="container">
          <h1 className="text-3xl font-bold mb-6">Transportation Listings</h1>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-1/3 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by destination or start place..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-full md:w-64" id="price-range">
                    <Label
                      htmlFor="price-range"
                      className="text-sm font-medium mb-2 block"
                    >
                      Price Range
                    </Label>
                    <Slider
                      id="price-range"
                      value={priceRange}
                      max={10000}
                      step={1}
                      onValueChange={handlePriceRangeChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <Input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-20 text-right"
                      />
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <Label
                        htmlFor="sort-criteria"
                        className="text-sm font-medium mb-2 block"
                      >
                        Sort by
                      </Label>
                      <Select
                        onValueChange={handleSortChange}
                        defaultValue={sortCriteria}
                      >
                        <SelectTrigger id="sort-criteria" className="w-[120px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSortOrderToggle}
                      className="mt-6"
                    >
                      <ArrowUpDown
                        className={`h-4 w-4 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
                <div>
                  <Label
                    htmlFor="date-picker"
                    className="text-sm font-medium mb-2 block"
                  >
                    Date
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="date-picker"
                      name="date-picker"
                      value={
                        selectedDate
                          ? selectedDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleDateChange}
                      className="pl-10 pr-4 h-10 w-[200px]"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="vehicle-type"
                    className="text-sm font-medium mb-2 block"
                    id="filter"
                  >
                    Vehicle Type
                  </Label>
                  <Select
                    onValueChange={handleVehicleTypeChange}
                    defaultValue={selectedVehicleType}
                  >
                    <SelectTrigger id="vehicle-type" className="w-[150px]">
                      <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Boat">Boat</SelectItem>
                      <SelectItem value="Helicopter">Helicopter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ECommerceDefaultSkeleton key={index} />
              ))
            ) : filteredTransportations.length > 0 ? (
              filteredTransportations.map((transportation) => (
                <TransportationCard
                  key={transportation._id}
                  transportationId={transportation._id}
                  destination={transportation.destination}
                  startPlace={transportation.startPlace}
                  currrn={sessionStorage.getItem("curr")}
                  price={(
                    transportation.price / (exchangeRates[currency] || 1)
                  ).toFixed(2)}
                  vehicleType={transportation.vehicleType}
                  availability={transportation.availability}
                  discount={transportation.discount}
                  ratings={transportation.ratings}
                  date={transportation.date}
                  advertiserId={transportation.advertiserId}
                  quantity={
                    transportation.vehicleType === "Car"
                      ? 3
                      : transportation.vehicleType === "Bus"
                        ? 7
                        : transportation.vehicleType === "Boat"
                          ? 5
                          : 4
                  }
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No transportation options found
              </p>
            )}
          </div>
        </div>
      </TransportaionTour>
      <TourismGovernerFooter />
    </>
  );
};

export default Transportation;
