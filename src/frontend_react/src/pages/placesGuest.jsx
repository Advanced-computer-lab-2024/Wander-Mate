"use client";

import { useState, useEffect } from "react";
import PlaceCardGuest from "../components/placesCardGuest";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
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
import { Filter, X } from "lucide-react";
import ViewPlacesTour from "../components/placesTour";
import GuestNavigationMenuBar from "../components/Guestnavbar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function PlacesGuest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const combo=sessionStorage.getItem("curr");

  const fetchImages = async (activityId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/getPlaceImage/${activityId}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Error fetching images for place:", activityId);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    return [];
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
      const response = await fetch("http://localhost:8000/readHistoricalTags");
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

  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8000/readPlaces");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const placesWithImages = await Promise.all(
        data.map(async (place) => {
          const images = await fetchImages(place._id);
          return {
            ...place,
            images,
          };
        })
      );
      setPlaces(placesWithImages);
    } catch (error) {
      console.error("Error fetching places:", error);
      alert("Could not load places. Please try again later.");
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
      await fetchCategories();
      await fetchTags();
      await fetchPlaces();
    };

    fetchData();
  }, []);

  const filteredPlaces = places.filter((place) => {
    if (selectedCategory === " ") {
      setSelectedCategory("");
    }

    const matchesName = place.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesCategory = selectedCategory
      ? place.Category === selectedCategory
      : true;
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.some((tag) => place.Tags.includes(tag))
        : true;

    return matchesName && matchesCategory && matchesTags;
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (value) => setSelectedCategory(value);
  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedTags([]);
  };

  return (
    <>
    <GuestNavigationMenuBar  />
      <ViewPlacesTour>
        <div className="container mx-auto p-4" id="container">
          <h1 className="text-2xl font-bold mb-4">Places</h1>

          <div className="flex items-center space-x-4 mb-4">
            <Input
              type="text"
              placeholder="Search by place name"
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" id="filter">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ECommerceDefaultSkeleton key={index} />
              ))
            ) : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <PlaceCardGuest
                  currency={combo}
                  key={place._id}
                  name={place.Name}
                  images={place.Pictures}
                  latitude={place.Location.coordinates[1]}
                  longitude={place.Location.coordinates[0]}
                  description={place.Description}
                  tags={place.Tags.map((tagId) => tagMap[tagId])}
                  category={
                    categories.find((cat) => cat._id === place.Category)
                      ?.Name || "No Category"
                  }
                  TicketPrices={
                    place.TicketPrices / (exchangeRates[currency] || 1)
                  }
                />
              ))
            ) : (
              <p>No places found</p>
            )}
          </div>
        </div>
      </ViewPlacesTour>
      <TourismGovernerFooter />
      
    </>
  );
}
