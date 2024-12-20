"use client";

import { useState, useEffect } from "react";
import ActivityCardGuest from "../components/activitiesCardGuest";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Filter, Loader } from "lucide-react";
import GuestFooter from "../components/GuestFooter";
import GuestNavigationMenuBar from "../components/Guestnavbar";

export default function ActivitiesGuest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [types, setTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const combo = sessionStorage.getItem("curr");
  const [likedItemsCount, setLikedItemsCount] = useState(0);

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

  const handleCategoryChange = (value) => setSelectedCategory(value);

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

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:8000/viewActivities");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setActivities(
        data.map((activity) => ({ ...activity, rating: activity.rating || 0 }))
      );
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Could not load activities. Please try again later.");
    } finally {
      setLoading(false);
    }
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
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchTags(), fetchActivities()]);
    };

    fetchData();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    if (selectedCategory === " ") {
      setSelectedCategory("");
    }

    const matchesName = activity.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesCategory = selectedCategory
      ? activity.Category === selectedCategory
      : true;
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.some((tag) => activity.Tags.includes(tag))
        : true;

    return matchesName && matchesCategory && matchesTags;
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleTypeChange = (value) => setSelectedType(value);
  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedTags([]);
  };

  return (
    <>
    <GuestNavigationMenuBar likedItemsCount={likedItemsCount} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Activities</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="text"
            placeholder="Search by activity name"
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with these filters.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent portal={false}>
                      <SelectItem value=" ">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag._id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`tag-${tag._id}`}
                          checked={selectedTags.includes(tag._id)}
                          onChange={() => handleTagChange(tag._id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`tag-${tag._id}`}>{tag.Name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCardGuest
                currency={combo}
                key={activity._id}
                activityId={activity._id}
                name={activity.Name}
                location={activity.Location}
                type={
                  types.find((t) => t._id === activity.Category)?.Name ||
                  "Unknown Category"
                }
                tags={activity.Tags.map((tagId) => tagMap[tagId])}
                price={(
                  activity.Price / (exchangeRates[currency] || 1)
                ).toFixed(2)}
                date={activity.Date}
                time={activity.Time}
                category={activity.Category}
                isAvailable={activity.IsAvailable}
                rating={activity.rating}
              />
            ))
          ) : (
            <p className="col-span-full text-center">No activities found</p>
          )}
        </div>
      </div>
      <GuestFooter />
    </>
  );
}
