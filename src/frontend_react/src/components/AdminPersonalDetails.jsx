"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function AdminDetailsView() {
  const [details, setDetails] = useState({
    username: "Loading...",
    email: "Loading...",
  });

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const username =
          sessionStorage.getItem("username") || "No username found";
        setDetails((prevDetails) => ({ ...prevDetails, username }));
      } catch (error) {
        console.error("Error loading admin details:", error);
        setDetails({ username: "Error", email: "Error" });
      }
    };
    loadDetails();
  }, []);

  return (
    <React.Fragment>
      <div className="w-full max-w-3xl p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent"></TabsList>
          <TabsContent value="personal" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="p-2 bg-muted rounded-md">
                  {details.username}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
}
