import React, { Component } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import NonMovableMap from "./ui/nonMovableMap";

const BookmarkModel = ({ bookmark, isOpen, setIsOpen, children }) => {
  const handleOpenChange = (open) => {
    console.log(bookmark);
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (window.location.search.includes("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("place");
        window.history.replaceState({}, "", url);
        window.location.reload();
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {" "}
      <DialogTrigger asChild>{children}</DialogTrigger>{" "}
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        {" "}
        <h1>Ayhaga</h1> <h1>{bookmark._id}</h1>{" "}
        <div className="relative">
          {" "}
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            {" "}
            <Icon icon="ph:x" className="h-4 w-4" />{" "}
          </Button>{" "}
        </div>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
};

export default BookmarkModel;
