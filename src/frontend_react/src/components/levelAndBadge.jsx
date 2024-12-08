"use client";

import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Star, Gem, Crown, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import React from "react";

import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const LevelAndBadge = () => {
  const [touristBadge, setTouristBadge] = useState(null);
  const [touristWallet, setTouristWallet] = useState(null);
  const [touristPoints, setPoints] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState(0);

  useEffect(() => {
    const fetchTouristBadge = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();

        const levelReply = await fetch(
          `http://localhost:8000/getTouristLevel/${userID}`
        );
        if (!levelReply.ok) throw new Error("Failed to get tourist level");

        const { Badge } = await levelReply.json();
        setTouristBadge(Badge);

        const walletReply = await fetch(
          `http://localhost:8000/getTouristWallet/${userID}`
        );
        if (!walletReply.ok) throw new Error("Failed to get tourist wallet");

        const { Wallet } = await walletReply.json();
        setTouristWallet(Wallet);

        const pointsReply = await fetch(
          `http://localhost:8000/getTouristPoints/${userID}`
        );
        if (!pointsReply.ok) throw new Error("Failed to get tourist points");
        const { Points } = await pointsReply.json();
        setPoints(Points);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };

    fetchTouristBadge();
  }, []);

  const handleRedeemPoints = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const response = await fetch("http://localhost:8000/redeempoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          touristID: userID,
          pointsToRedeem: redeemAmount,
        }),
      });

      if (!response.ok) throw new Error("Failed to redeem points");

      const data = await response.json();
      setTouristWallet(data.updatedWalletBalance);
      setPoints(data.remainingPoints);
      toast.success(
        `Successfully redeemed ${redeemAmount} points! Cash equivalent: ${data.cashEquivalent} EGP`
      );
    } catch (error) {
      console.error("Error redeeming points:", error);
      toast.error(error.message);
    }
  };

  let badgeContent = {
    icon: <Star className="mr-1 h-3 w-3" />,
    text: "Loading...",
    color: "bg-gray-500 text-white",
  };

  if (touristBadge === "level 1") {
    badgeContent = {
      icon: <Star className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-gray-300 text-gray-800",
    };
  } else if (touristBadge === "level 2") {
    badgeContent = {
      icon: <Gem className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-purple-500 text-white",
    };
  } else if (touristBadge === "level 3") {
    badgeContent = {
      icon: <Crown className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-yellow-400 text-black",
    };
  } else if (touristBadge !== null) {
    badgeContent = {
      icon: <Star className="mr-1 h-3 w-3" />,
      text: ` ${touristBadge}`,
      color: "bg-blue-500 text-white",
    };
  }

  return (
    <React.Fragment>
      <Card className="w-full max-w-[1500px]">
        <CardContent className="flex items-center justify-between p-6">
          <Toaster />
          {/* <Badge className={`flex items-center ${badgeContent.color}`}>
            {badgeContent.icon}
            {badgeContent.text}
          </Badge> */}
          <div className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            <span>
              {touristWallet !== null
                ? `Wallet: ${touristWallet}`
                : "Wallet: 0"}
            </span>
          </div>
          <div>
            <span>
              {touristPoints !== null
                ? `Points: ${touristPoints}`
                : "Points: 0"}
            </span>
          </div>
          <div>
            <input
              type="number"
              className="border rounded p-1 mr-2"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              placeholder="Points to redeem"
            />
            <Button
              className="text-white px-4 py-2 rounded"
              onClick={handleRedeemPoints}
            >
              Redeem Points
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default LevelAndBadge;
