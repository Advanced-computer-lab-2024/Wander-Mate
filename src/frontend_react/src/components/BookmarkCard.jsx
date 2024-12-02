import React, { Component } from "react";
import BookmarkModel from "./BookmarkModel";
import { Card } from "./ui/card";
import { useState } from "react";

const BookmarkCard = ({ bookmark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [bookmark, setBookmark] = useState("nadeem");
  return (
    <Card>{bookmark} </Card>
    // <BookmarkModel
    //   bookmark={bookmark}
    //   isOpen={isModalOpen}
    //   setIsOpen={setIsModalOpen}
    // >
    //   {/* <Card>Balabizo</Card> */}

    // </BookmarkModel>
  );
};

export default BookmarkCard;
