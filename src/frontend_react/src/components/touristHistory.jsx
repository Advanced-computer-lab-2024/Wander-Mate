"use client";

import React from 'react';
import NavigationMenuBar from './NavigationMenuBar';
import CompletedItineraries from './completedItineraries';
import CompletedActivities from './completedActivities';
import TouristOrdersTable from './touristOrders';

const TouristHistory = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationMenuBar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Travel History</h1>
        <section>
          {/* <h2 className="text-2xl font-semibold mb-4">Completed Itineraries</h2> */}
          <CompletedItineraries />
        </section>
        <section>
          {/* <h2 className="text-2xl font-semibold mb-4">Completed Activities</h2> */}
          <CompletedActivities />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Order History</h2>
          <TouristOrdersTable />
        </section>
      </main>
    </div>
  );
};

export default TouristHistory;
