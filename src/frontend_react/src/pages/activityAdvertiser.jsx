import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, ArrowUpDown } from 'lucide-react';
import ActivityCard from "../components/activityCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import NavigationMenuBar from "../components/NavigationMenuBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function AdvertiserPage() {
  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const advertiserId = location.state?.advertiserId;

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const combo = sessionStorage.getItem("curr");


  useEffect(() => {
    const fetchData = async () => {
      if (advertiserId) {
        try {
          setIsLoading(true);
          const [advertiserResponse, activitiesResponse] = await Promise.all([
            axios.get(`http://localhost:8000/getAdvertiserById/${advertiserId}`),
            axios.get("http://localhost:8000/viewActivities"),
          ]);

          setAdvertiserInfo(advertiserResponse.data.advertiser);
          const advertiserActivities = activitiesResponse.data.filter(
            (activity) => activity.Creator === advertiserId
          );
          console.log(advertiserActivities);
          setAllActivities(advertiserActivities);
          setFilteredActivities(advertiserActivities);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            "Failed to load advertiser information and activities. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("No advertiser ID provided. Please go back and try again.");
        setIsLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/getCategories");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Could not load categories. Please try again later.");
      }
    };
  
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/readPreferenceTags");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const tagMapping = {};
        data.forEach((tag) => {
          tagMapping[tag._id] = tag.Name;
        });
        setTags(data);
        setTagMap(tagMapping);
      } catch (error) {
        console.error("Error fetching tags:", error);
        alert("Could not load tags. Please try again later.");
      }
    };

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
    fetchCategories();
    fetchTags();
    fetchData();
  }, [advertiserId]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, minPrice, maxPrice, sortCriteria, sortOrder, allActivities]);

  const handleFilterAndSort = () => {
    let updatedActivities = allActivities
      .filter(
        (activity) =>
          activity.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          activity.Price >= minPrice &&
          activity.Price <= maxPrice
      )
      .sort((a, b) => {
        if (sortCriteria === "date") {
          return sortOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        if (sortCriteria === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
    setFilteredActivities(updatedActivities);
  };

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

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  };

  const AdvertiserInfoSkeleton = () => (
    <Card className="mb-8">
      <CardContent className="flex items-center space-x-4 pt-6">
        <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <NavigationMenuBar />
      <div className="container mx-auto p-4">
        {isLoading ? (
          <AdvertiserInfoSkeleton />
        ) : (
          <Card className="mb-8">
            <CardContent className="flex items-center space-x-4 pt-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={getImageSrc(advertiserInfo.picture)}
                  alt={advertiserInfo.FullName}
                />
                <AvatarFallback>
                  {getInitials(advertiserInfo.FullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{advertiserInfo.FullName}</h1>
                <p className="text-gray-500">{advertiserInfo.email}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-xl font-bold mb-6">Advertiser's Activities</h2>
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-64">
                  <Label
                    htmlFor="price-range"
                    className="text-sm font-medium mb-2 block"
                  >
                    Price Range
                  </Label>
                  <Slider
                    id="price-range"
                    value={priceRange}
                    max={1000}
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
                        <SelectItem value="date">Date</SelectItem>
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ECommerceDefaultSkeleton key={index} />
            ))
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard
              currency={combo}
              key={activity._id}
              activityId={activity._id}
              name={activity.Name}
              location={activity.Location}
              type={
                categories.find((c) => c._id === activity.Category)?.Name ||
                "Unknown Category"
              }
              tags={activity.Tags.map((tagId) => tagMap[tagId])}
              price={(
                activity.Price / (exchangeRates[currency] || 1)
              ).toFixed(2)}
              date={activity.Date}
              time={activity.Time}
              category={
                categories.find((cat) => cat._id === activity.Category)
                  ?.Name || "No Category"
              }
              isAvailable={activity.IsAvailable}
              rating={activity.Ratings}
              Creator={activity.Creator}

              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No activities found
            </p>
          )}
        </div>
      </div>
      <TourismGovernerFooter />
    </>
  );
}
