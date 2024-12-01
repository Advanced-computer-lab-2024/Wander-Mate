import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

const TouristDetailsModal = ({ isOpen, onClose, tourists, itineraryName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tourists for {itineraryName}</DialogTitle>
          <DialogDescription>
            List of tourists who booked this itinerary
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {tourists.length > 0 ? (
            <ul className="list-disc pl-5">
              {tourists.map((tourist, index) => (
                <li key={index} className="mb-1">{tourist}</li>
              ))}
            </ul>
          ) : (
            <p>No tourists have booked this itinerary yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TouristDetailsModal;
