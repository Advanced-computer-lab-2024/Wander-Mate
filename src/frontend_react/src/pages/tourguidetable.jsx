import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { cn } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Icon } from "@iconify/react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const TourGuideTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [tourGuides, setTourGuides] = useState([]); // Store tour guides here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTourGuides = async () => {
      try {
        const response = await axios.get("http://localhost:8000/gettourguides");
        console.log(response.data); // Check response data structure
        setTourGuides(response.data.Creator); // Store tour guide data
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchTourGuides();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  const deletetourguide = async (tourGuide) => {
    
      const deleteTourguide =  axios.delete("http://localhost:8000/deleteaccount", {
        data: { Username: tourGuide.Username,
          userID: tourGuide._id,
         },
      });
      toast.promise(
        deleteTourguide,
        {
          loading: "Deleting TourGuide...",
          success: "TourGuide account deleted successfully!",
          error: "Error deleting the account.",
        },
        {
          // Optional settings for the toast (you can customize these)
          success: {
            duration: 4000, // The toast will disappear after 4 seconds
            icon: "✅",
          },
          error: {
            duration: 4000,
            icon: "❌",
          },
        }
      );
      try {
        const response = await deleteTourguide;
      if (response.status === 200) {
        // Remove the tourist from the state if the deletion is successful
        setTourGuides(tourGuides.filter(tourGuide1 => tourGuide1.Username !== tourGuide.Username));
        alert("tourGuide account deleted successfully!");
      }
    } catch (err) {
      setError("An error occurred while deleting the account");
      alert("Error deleting account");
    }
  };


  const columns = [
    {
      key: "user",
      label: "User",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
        const base64String =
          typeof picture.data === "string"
            ? picture.data
            : btoa(String.fromCharCode.apply(null, new Uint8Array(picture.data)));
        return `data:${picture.contentType};base64,${base64String}`;
      }
      return null;
  };

  return (
    <>
    <Toaster/>
    <Table>
      <TableHeader className="text-left">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tourGuides.map((tourGuide) => (
          <Fragment key={tourGuide._id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => toggleRow(tourGuide._id)}
                    size="icon"
                    variant="outline"
                    color="secondary"
                    className="h-7 w-7 border-none rounded-full"
                  >
                    <Icon
                      icon="heroicons:chevron-down"
                      className={cn("h-5 w-5 transition-all duration-300", {
                        "rotate-180": collapsedRows.includes(tourGuide._id),
                      })}
                    />
                  </Button>
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-full">
                      <AvatarImage src={getImageSrc(tourGuide.picture)} />
                      <AvatarFallback>{tourGuide.Username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm block text-card-foreground">
                        {tourGuide.Username}
                      </span>
                      <span className="text-xs mt-1 block font-normal">
                        {tourGuide.Email}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{tourGuide.status}</TableCell>
              <TableCell>
                <a href={`mailto:${tourGuide.Email}`} target="_blank" rel="noopener noreferrer">
                  {tourGuide.Email}
                </a>
              </TableCell>
              <TableCell className="flex items-center justify-start px-4 py-6">
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7 border-none p-0" onClick={()=> deletetourguide(tourGuide)}
                >
                  <Icon icon="heroicons:trash" className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
            {collapsedRows.includes(tourGuide._id) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="pl-12 flex flex-col items-start">
                    <p>Created At: {new Date(tourGuide.createdAt).toLocaleDateString()}</p>
                    <p>Updated At: {new Date(tourGuide.updatedAt).toLocaleDateString()}</p>
                    {tourGuide.MobileNumber && <p>Mobile: {tourGuide.MobileNumber}</p>}
                    {tourGuide.PreviousWork && <p>Previous Work: {tourGuide.PreviousWork}</p>}
                    {tourGuide.YearsOfExperience && <p>Experience: {tourGuide.YearsOfExperience} years</p>}
                    {tourGuide.averageRating && <p>Average Rating: {tourGuide.averageRating}</p>}
                    {tourGuide.totalRatings && <p>Total Ratings: {tourGuide.totalRatings}</p>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </>
  );
};

export default TourGuideTable;
