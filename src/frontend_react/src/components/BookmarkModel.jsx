import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";

const BookmarkModal = ({ bookmark, type, isOpen, setIsOpen }) => {
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("place");
        window.history.replaceState({}, "", url);
      }
    }
  };

  return (
    //     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
    //       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    //         <DialogHeader>
    //           <DialogTitle>{bookmark.name || "Unnamed Bookmark"}</DialogTitle>
    //           <DialogDescription>
    //             {type === "attraction" ? "Attraction Details" : "Itinerary Details"}
    //           </DialogDescription>
    //         </DialogHeader>
    //         <div className="mt-4">
    //           {type === "attraction" ? (
    //             <>
    //               <p>
    //                 <strong>Location:</strong> {bookmark.location}
    //               </p>
    //               <p>
    //                 <strong>Description:</strong> {bookmark.description}
    //               </p>
    //               {/* Add more attraction-specific details here */}
    //             </>
    //           ) : (
    //             <>
    //               <p>
    //                 <strong>Duration:</strong> {bookmark.duration}
    //               </p>
    //               <p>
    //                 <strong>Destinations:</strong>{" "}
    //                 {bookmark.destinations.join(", ")}
    //               </p>
    //               {/* Add more itinerary-specific details here */}
    //             </>
    //           )}
    //         </div>
    //         <div className="mt-4 flex justify-end">
    //           <Button variant="ghost" onClick={() => handleOpenChange(false)}>
    //             <Icon icon="ph:x" className="h-4 w-4 mr-2" />
    //             Close
    //           </Button>
    //         </div>
    //       </DialogContent>
    //     </Dialog>
    <h1>s</h1>
  );
};

export default BookmarkModal;
