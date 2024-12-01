import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { useToast } from "../components/ui/use-toast";
import { CalendarIcon, CreditCardIcon, HomeIcon, MapPinIcon, PlaneIcon, TrainIcon } from 'lucide-react';

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTouristID();
  }, []);

  const fetchTouristID = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('No username found in session storage.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/getID/${username}`);
      if (!response.ok) throw new Error("Failed to fetch tourist ID");

      const { userID } = await response.json();
      fetchBookings(userID);
    } catch (error) {
      console.error("Error fetching tourist ID:", error);
      toast({
        title: "Error",
        description: "Could not load tourist information.",
        variant: "destructive",
      });
    }
  };

  const fetchBookings = async (touristID) => {
    try {
      const response = await fetch(`http://localhost:8000/getMyBookings/${touristID}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");

      const fetchedBookings = await response.json();
      setBookings(fetchedBookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "No bookings found",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingID, createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const hoursDifference = Math.abs(createdDate - currentDate) / 36e5;

    if (hoursDifference > 48 || window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(`http://localhost:8000/cancelBooking/${bookingID}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to cancel booking.");
        }

        toast({
          title: "Success",
          description: "Booking cancelled successfully.",
        });

        // Reload bookings to update the list
        const touristID = sessionStorage.getItem('touristID');
        if (touristID) fetchBookings(touristID);
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast({
          title: "Error",
          description: error.message || "Could not cancel booking. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const getItemIcon = (itemModel) => {
    switch (itemModel) {
      case 'Attraction':
        return <MapPinIcon className="h-4 w-4" />;
      case 'Itinerary':
        return <CalendarIcon className="h-4 w-4" />;
      case 'Transportation':
        return <TrainIcon className="h-4 w-4" />;
      case 'HotelBooked':
        return <HomeIcon className="h-4 w-4" />;
      case 'BookedFlights':
        return <PlaneIcon className="h-4 w-4" />;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  const handleViewDetails = async (booking) => {
    try {
      // Assuming the backend expects the booking ID as part of the URL path
      const response = await fetch(`http://localhost:8000/getBookingDetails/${booking._id}`);
      
      if (!response.ok) throw new Error("Failed to fetch booking details");

      const { booking: fetchedBooking } = await response.json();
      // Assuming the `fetchedBooking` contains all the necessary details including the populated `itemId`
      console.log(fetchedBooking);
      setSelectedBooking({
        ...fetchedBooking,
        itemDetails: fetchedBooking.itemId, // The item details will now be in `itemId` after being populated on the backend
      });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>View and manage your upcoming bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <React.Fragment key={booking._id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      {getItemIcon(booking.itemModel)}
                      <h3 className="text-lg font-semibold ml-2">{booking.itemModel}</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booked for: {new Date(booking.bookedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Cancel Booking</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to cancel this booking?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently cancel your booking.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            cancelBooking(booking._id, booking.createdAt);
                            setSelectedBooking(null);
                          }}
                        >
                          Confirm Cancellation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={selectedBooking?._id === booking._id} onOpenChange={(open) => {
                    if (!open) setSelectedBooking(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleViewDetails(booking)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                      {selectedBooking?.itemDetails && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedBooking.itemModel} Details</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            {selectedBooking.itemModel === 'Attraction' && (
                              <>
                                <p>Name: {selectedBooking.itemDetails.Name}</p>
                                <p>Price: ${selectedBooking.itemDetails.Price}</p>
                              </>
                            )}
                            {selectedBooking.itemModel === 'Itinerary' && (
                              <>
                                <p>Name: {selectedBooking.itemDetails.Name}</p>
                                <p>Language: {selectedBooking.itemDetails.Language}</p>
                                <p>Price: ${selectedBooking.itemDetails.Price}</p>
                                <p>Timeline: {selectedBooking.itemDetails.TimeLine}</p>
                              </>
                            )}
                            {selectedBooking.itemModel === 'Transportation' && (
                              <>
                                <p>Destination: {selectedBooking.itemDetails.destination}</p>
                                <p>Start Place: {selectedBooking.itemDetails.startPlace}</p>
                                <p>Vehicle Type: {selectedBooking.itemDetails.vehicleType}</p>
                                <p>Price: ${selectedBooking.itemDetails.price}</p>
                              </>
                            )}
                            {selectedBooking.itemModel === 'HotelBooked' && (
                              <>
                                <p>Title: {selectedBooking.itemDetails.title}</p>
                                <p>Check-in: {new Date(selectedBooking.itemDetails.checkIn).toLocaleDateString()}</p>
                                <p>Check-out: {new Date(selectedBooking.itemDetails.checkOut).toLocaleDateString()}</p>
                                <p>Price: ${selectedBooking.itemDetails.price}</p>
                                <p>Provider: {selectedBooking.itemDetails.provider}</p>
                              </>
                            )}
                            {selectedBooking.itemModel === 'BookedFlights' && (
                              <>
                                <p>Departure: {new Date(selectedBooking.itemDetails.departureDate).toLocaleString()}</p>
                                <p>Arrival: {new Date(selectedBooking.itemDetails.arrivalDate).toLocaleString()}</p>
                                <p>Price: ${selectedBooking.itemDetails.price}</p>
                              </>
                            )}
                          </DialogDescription>
                        </>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedBooking(null)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Separator />
              </React.Fragment>
            ))
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter />
    </Card>
  );
};

export default UpcomingBookings;
