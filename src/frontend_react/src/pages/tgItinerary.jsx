import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ItineraryCard from "../components/itineraryCard"; // Import the ItineraryCard component
import TourGuideNavBar from "../components/tourGuideNavBar";

export default function TourGuidePage() {
  const [tourGuide, setTourGuide] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTourGuideData = async () => {
      const params = new URLSearchParams(location.search);
      const creatorId = params.get("creator");

      if (creatorId) {
        try {
          // Fetch tour guide details
          const guideResponse = await axios.get(`http://localhost:8000/getTourGuide/${creatorId}`);
          setTourGuide(guideResponse.data);

          // Fetch itineraries
          const itinerariesResponse = await axios.get(`http://localhost:8000/getTourGuideItineraries/${creatorId}`);
          setItineraries(itinerariesResponse.data);

          // Fetch reviews
          const reviewsResponse = await axios.get(`http://localhost:8000/getGuideReviews/${creatorId}`);
          setReviews(reviewsResponse.data);
        } catch (error) {
          console.error("Error fetching tour guide data:", error);
        }
      }
    };

    fetchTourGuideData();
  }, [location]);

  const renderStars = (rating) => {
    if (typeof rating !== "number" || isNaN(rating)) {
      rating = 0; // Default to 0 if the rating is invalid
    }
  
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return [
      ...Array(fullStars).fill(<FaStar className="text-yellow-500" />),
      ...Array(halfStars).fill(<FaStarHalfAlt className="text-yellow-500" />),
      ...Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />),
    ];
  };

  if (!tourGuide) {
    return <div>Loading...</div>;
  }

  return (
    <><TourGuideNavBar/>
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{tourGuide.Username}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(tourGuide.averageRating).map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
            <span className="text-gray-600">
              ({typeof tourGuide.averageRating === "number" ? tourGuide.averageRating.toFixed(1) : "0.0"})
            </span>
          </div>
          <p className="text-gray-600">Email: {tourGuide.Email}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="itineraries">
        <TabsList>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="itineraries">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary._id}
                itineraryId={itinerary._id}
                name={itinerary.name}
                images={itinerary.images}
                tags={itinerary.tags}
                duration={itinerary.duration}
                latitude={itinerary.latitude}
                longitude={itinerary.longitude}
                reviews={itinerary.reviews}
                TimeLine={itinerary.TimeLine}
                price={itinerary.price}
                AvailableDates={itinerary.AvailableDates}
                Activities={itinerary.Activities}
                LocationsToVisit={itinerary.LocationsToVisit}
                PickUpLocation={itinerary.PickUpLocation}
                DropOffLocation={itinerary.DropOffLocation}
                Language={itinerary.Language}
                currrn={itinerary.currrn}
                rating={itinerary.rating}
                Creator={itinerary.Creator}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent>
              {reviews.length > 0 ? (
                <ul className="space-y-4">
                  {reviews.map((review, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium">{review.username}</span>
                        <div className="flex ml-2">
                          {renderStars(review.rating).map((star, starIndex) => (
                            <span key={starIndex}>{star}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.review}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}

