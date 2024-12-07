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
    title: "Welcome to Transportations",
    text: "This tour will guide you through the main features of our transpotations page.",
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
    title: "Search transportations",
    text: "Use this search bar to find specific transportations by name.",
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
    id: "filter",
    attachTo: { element: "#price-range", on: "bottom" },
    title: "filter Transportations",
    text: "filter transportations by price using this price range.",
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
    id: "sort",
    attachTo: { element: "#sort-criteria", on: "bottom" },
    title: "Sort Transportations",
    text: "Sort transportations by rating or price using this dropdown.",
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
    id: "filter",
    attachTo: { element: "#date-picker", on: "bottom" },
    title: "filter Transportations",
    text: "filter transportations by date using this date picker.",
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
    id: "filter",
    attachTo: { element: "#vehicle-type", on: "bottom" },
    title: "filter Transportations",
    text: "filter transportations by vehicle type using this dropdown.",
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
    id: "transportation-card",
    attachTo: { element: ".grid > div:first-child", on: "bottom" },
    title: "Transportation Card",
    text: "Each card represents a Transportation. Click on a card to view more details and start your journey.",
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

const TransportaionTour = ({ children }) => {
  return (
    <div>
      <TourButton />
      {children}
    </div>
  );
};

export default TransportaionTour;
