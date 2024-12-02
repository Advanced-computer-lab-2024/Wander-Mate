import React, { useEffect, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import NavigationMenuBar from "../components/NavigationMenuBar";
import axios from "axios";

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBookmarks = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) {
        throw new Error("Username not found in session storage");
      }

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const response = await axios.get(
        `http://localhost:8000/ViewBookmarkedAttractions/${userID}`
      );
      console.log(response.data.bookmarkedAttractions);
      setBookmarks(response.data.bookmarkedAttractions); // Set the data property of the response
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setError("Could not load places. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <React.Fragment>
      <NavigationMenuBar />
      {bookmarks.length === 0 ? (
        <div>No bookmarks found.</div>
      ) : (
        <ul>
          {bookmarks.map((bookmark, index) => (
            <li key={bookmark.id || index}>
              <BookmarkCard bookmark={bookmark} />
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default ViewBookmarks;
