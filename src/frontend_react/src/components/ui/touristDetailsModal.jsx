import React from 'react';
import PropTypes from 'prop-types';
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
      <DialogContent className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6" size="full">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Tourists for {itineraryName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Below is the list of tourists who booked this itinerary
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {tourists.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {tourists.map((tourist, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-gray-50 p-3 rounded-md shadow-sm"
                >
                  <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    {/* Initials or avatar */}
                    <span className="font-semibold text-xs">
                      {tourist.name ? tourist.name[0] : tourist.Username[0]}
                    </span>
                  </div>
                  <span className="mt-1 font-medium text-gray-700 text-xs">
                    {tourist.name || tourist.Username}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No tourists have booked this itinerary yet.
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Prop validation
TouristDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tourists: PropTypes.array.isRequired,
  itineraryName: PropTypes.string.isRequired,
};

export default TouristDetailsModal;
