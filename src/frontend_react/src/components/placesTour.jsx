import React, { useState, useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: "shadow-md bg-purple-dark",
    scrollTo: { behavior: "smooth", block: "center" },
  },
  useModalOverlay: true,
};

const steps = [
  {
    id: "welcome",
    attachTo: { element: "#container", on: "top" },
    title: "Welcome to Places",
    text: "This tour will guide you through the main features of our places page.",
    buttons: [
      {
        action() {
          return this.next();
        },
        text: "Next",
      },
    ],
  },
  {
    id: "search",
    attachTo: { element: "input[type='text']", on: "bottom" },
    title: "Search Itineraries",
    text: "Use this search bar to find specific places by name.",
    buttons: [
      {
        action() {
          return this.back();
        },
        text: "Back",
      },
      {
        action() {
          return this.next();
        },
        text: "Next",
      },
    ],
  },
 
  {
    id: "filters",
    attachTo: { element: "#filter", on: "bottom" },
    title: "Apply Filters",
    text: "Click here to open the filters panel and refine your search.",
    buttons: [
      {
        action() {
          return this.back();
        },
        text: "Back",
      },
      {
        action() {
          return this.next();
        },
        text: "Next",
      },
    ],
  },
  {
    id: "place-card",
    attachTo: { element: ".grid > div:first-child", on: "bottom" },
    title: "Place Card",
    text: "Each card represents a unique place. Click on a card to view more details and start exploring.",
    buttons: [
      {
        action() {
          return this.back();
        },
        text: "Back",
      },
      {
        action() {
          return this.complete();
        },
        text: "Finish",
      },
    ],
  },
];

const TourButton = () => {
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const newTour = new Shepherd.Tour(tourOptions);

    steps.forEach((step) => {
      const updatedStep = {
        ...step,
        beforeShowPromise: function () {
          return new Promise((resolve) => {
            if (this.el) {
              setTimeout(() => {
                resolve();
              }, 100);
            } else {
              resolve();
            }
          });
        },
      };
      newTour.addStep(updatedStep);
    });

    setTour(newTour);

    return () => {
      if (newTour) {
        newTour.complete();
      }
    };
  }, []);

  const startTour = () => {
    if (tour) {
      tour.start();
    }
  };

  return (
    <Button
      onClick={startTour}
      size="icon"
      className="fixed bottom-4 right-4 z-50 rounded-full"
    >
      <Icon
        icon="heroicons:exclamation-circle-20-solid"
        className=" h-6 w-6 "
      />
    </Button>
  );
};

const ViewPlacesTour = ({ children }) => {
  return (
    <div>
      <TourButton />
      {children}
    </div>
  );
};

export default ViewPlacesTour;
