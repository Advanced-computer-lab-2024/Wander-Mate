"use client";

import React, { useState, useEffect } from "react";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import ItineraryCard from "../components/itineraryCard";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Filter, ArrowUpDown } from "lucide-react";
import ViewItinerariesTour from "../components/ViewItinerariesTour";

export default function ViewItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagMap, setTagMap] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");

  // Filter states
  const [budget, setBudget] = useState([0, 100000]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [language, setLanguage] = useState("");

  // Sorting state
  const [sortCriteria, setSortCriteria] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();

    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:8000/viewItineraries");
        const data = await response.json();
        setItineraries(data);
        setFilteredItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/readHistoricalTags"
        );
        const reply = await fetch("http://localhost:8000/readPreferenceTags");
        if (!response.ok || !reply.ok)
          throw new Error("Network response was not ok");
        const data = await response.json();
        const data2 = await reply.json();
        const tagMapping = {};
        data.forEach((tag) => {
          tagMapping[tag._id] = tag.Name;
        });
        data2.forEach((tag) => {
          tagMapping[tag._id] = tag.Name;
        });
        setTags([...data, ...data2]);
        setTagMap(tagMapping);
      } catch (error) {
        console.error("Error fetching tags:", error);
        alert("Could not load tags. Please try again later.");
      }
    };

    fetchTags();
    fetchItineraries();
  }, []);

  useEffect(() => {
    filterAndSortItineraries();
  }, [
    searchTerm,
    budget,
    startDate,
    endDate,
    selectedTags,
    language,
    itineraries,
    sortCriteria,
    sortOrder,
  ]);

  const handleTagSelection = (tagId) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagId)) {
        return prevSelectedTags.filter((id) => id !== tagId);
      } else {
        return [...prevSelectedTags, tagId];
      }
    });
  };

  const clearFilters = () => {
    setLanguage("");
    setBudget([0, 100000]);
    setStartDate("");
    setEndDate("");
    setSelectedTags([]);
    setSortCriteria("rating");
    setSortOrder("desc");
  };

  const filterAndSortItineraries = () => {
    let filtered = itineraries.filter((itinerary) => {
      if (itinerary.isFlagged) return false;
      const matchesSearch = itinerary.Name.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
      const convertedPrice = itinerary.Price * (exchangeRates[currency] || 1);
      const matchesBudget =
        convertedPrice >= budget[0] && convertedPrice <= budget[1];
      const filterStartDate = startDate ? new Date(startDate) : null;
      const filterEndDate = endDate ? new Date(endDate) : null;
      const matchesDate = itinerary.AvailableDates.some((date) => {
        const itineraryDate = new Date(date);
        return (
          (!filterStartDate || itineraryDate >= filterStartDate) &&
          (!filterEndDate || itineraryDate <= filterEndDate)
        );
      });
      const activityTags = itinerary.Activities.flatMap(
        (activity) => activity.Tags || []
      );
      const placeTags = itinerary.LocationsToVisit.flatMap(
        (place) => place.Tags || []
      );
      const allTags = [...activityTags, ...placeTags];
      const matchesTags =
        selectedTags.length === 0 ||
        allTags.some((tag) => selectedTags.includes(tag));
      const matchesLanguage =
        language === " " || !language || itinerary.Language === language;

      return (
        matchesSearch &&
        matchesBudget &&
        matchesDate &&
        matchesTags &&
        matchesLanguage
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (sortCriteria === "price") {
        return (a.Price - b.Price) * modifier;
      } else if (sortCriteria === "rating") {
        return (a.Rating - b.Rating) * modifier;
      }
      return 0;
    });

    setFilteredItineraries(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBudgetChange = (value) => {
    setBudget(value);
  };

  const handleSortCriteriaChange = (value) => {
    setSortCriteria(value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Available Itineraries</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ECommerceDefaultSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ViewItinerariesTour>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Available Itineraries</h1>

        <div className="flex items-center space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Search itineraries..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow"
          />
          <Label
            htmlFor="sort-criteria"
            className="text-sm font-medium mb-2 block"
          >
            Sort by
          </Label>
          <div className="flex items-center gap-2">
            <div>
              <Select
                onValueChange={handleSortCriteriaChange}
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
            >
              <ArrowUpDown
                className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" id="filter">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]" side="right">
              <SheetHeader>
                <SheetTitle>Filter Itineraries</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Slider
                    id="budget"
                    min={0}
                    max={100000}
                    step={100}
                    value={budget}
                    onValueChange={handleBudgetChange}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      id="budgetMin"
                      value={budget[0]}
                      onChange={(e) =>
                        setBudget([Number(e.target.value), budget[1]])
                      }
                      className="w-24"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      id="budgetMax"
                      value={budget[1]}
                      onChange={(e) =>
                        setBudget([budget[0], Number(e.target.value)])
                      }
                      className="w-24"
                    />
                  </div>
                </div>

                {/* Currency Dropdown */}
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  >
                    {exchangeRates &&
                      Object.keys(exchangeRates).map((cur) => (
                        <option key={cur} value={cur}>
                          {cur}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Preferences</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag._id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={tag._id}
                          checked={selectedTags.includes(tag._id)}
                          onChange={() => handleTagSelection(tag._id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={tag._id} className="text-sm">
                          {tag.Name}
                        </Label>
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
          {filteredItineraries.length > 0 ? (
            filteredItineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary._id}
                itineraryId={itinerary._id}
                name={itinerary.Name}
                images={itinerary.LocationsToVisit.flatMap(
                  (location) => location.Pictures || []
                )}
                tags={[
                  ...itinerary.LocationsToVisit.flatMap(
                    (location) => location.Tags || []
                  ),
                  ...itinerary.Activities.flatMap(
                    (activity) => activity.Tags || []
                  ),
                ].map((tagId) => tagMap[tagId])}
                price={(
                  itinerary.Price * (exchangeRates[currency] || 1)
                ).toFixed(2)}
                currrn={currency}
                rating={itinerary.Ratings}
                Activities={itinerary.Activities.map(
                  (activity) => activity.Name
                )}
                LocationsToVisit={itinerary.LocationsToVisit.map(
                  (location) => location.Name
                )}
                TimeLine={itinerary.TimeLine}
                AvailableDates={itinerary.AvailableDates}
                PickUpLocation={itinerary.PickUpLocation}
                DropOffLocation={itinerary.DropOffLocation}
                Language={itinerary.Language}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No itineraries found
            </p>
          )}
        </div>
      </div>
    </ViewItinerariesTour>
  );
}
