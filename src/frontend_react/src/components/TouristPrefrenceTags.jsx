"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

const TouristPreferenceTags = () => {
  const [userPreferences, setUserPreferences] = useState([]);
  const [availablePreferences, setAvailablePreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();

        // Fetch user's current preferences
        const userPrefsResponse = await axios.get(
          `http://localhost:8000/getPreferences/${userID}`
        );
        const userPrefs = Array.isArray(userPrefsResponse.data.data)
          ? userPrefsResponse.data.data
          : [];
        setUserPreferences(userPrefs);

        // Fetch available preferences
        const availablePrefsResponse = await axios.get(
          `http://localhost:8000/readPreferenceTags`
        );
        const allPrefs = availablePrefsResponse.data;

        // Filter out preferences the user already has
        const filteredPrefs = allPrefs.filter(
          (pref) => !userPrefs.some((userPref) => userPref.Name === pref.Name)
        );
        setAvailablePreferences(filteredPrefs);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePreference = async (preference) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      if (userPreferences.some((p) => p.Name === preference.Name)) {
        // Remove preference
        await axios.delete(
          `http://localhost:8000/removePreference/${userID}/${preference._id}`
        );
        setUserPreferences(
          userPreferences.filter((p) => p.Name !== preference.Name)
        );
        setAvailablePreferences([...availablePreferences, preference]);
      } else {
        // Add preference
        await axios.post(`http://localhost:8000/addPreferenceTag`, {
          touristId: userID,
          preference: preference,
        });
        setUserPreferences([...userPreferences, preference]);
        setAvailablePreferences(
          availablePreferences.filter((p) => p.Name !== preference.Name)
        );
      }
    } catch (error) {
      console.error("Error toggling preference:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="border-none mb-3">
          <CardTitle className="flex-1 text-lg font-medium text-default-800">
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-none mb-3">
        <CardTitle className="flex-1 text-lg font-medium text-default-800">
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {userPreferences.length > 0 ? (
            userPreferences.map((item, index) => (
              <Badge
                key={`preference-${index}`}
                variant="secondary"
                className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {item.Name}
                <button
                  onClick={() => togglePreference(item)}
                  className="ml-2 hover:text-destructive focus:outline-none"
                  aria-label={`Remove ${item.Name} preference`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No preferences selected
            </div>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-primary hover:text-primary-foreground hover:bg-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Preferences
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Preferences</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid gap-4">
                {availablePreferences.map((preference, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`preference-${index}`}
                      checked={userPreferences.some(
                        (p) => p.Name === preference.Name
                      )}
                      onChange={() => togglePreference(preference)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`preference-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {preference.Name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TouristPreferenceTags;
