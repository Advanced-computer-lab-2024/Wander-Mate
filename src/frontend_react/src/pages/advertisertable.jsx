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
import AdminNavBar from "../components/AdminNavBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const AdvertiserTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getadvertisers"
        );
        console.log(response.data);
        setAdvertisers(response.data.Creator);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchAdvertisers();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };
  const deleteAdvertiser = async (advertiser) => {
    const deleteadvertiser = axios.delete(
      "http://localhost:8000/deleteaccount",
      {
        data: { Username: advertiser.Username, userID: advertiser._id },
      }
    );
    toast.promise(
      deleteadvertiser,
      {
        loading: "Deleting advertiser...",
        success: "Advertiser account deleted successfully!",
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
      const response = await deleteadvertiser;
      if (response.status === 200) {
        // Remove the tourist from the state if the deletion is successful
        setAdvertisers(
          advertisers.filter(
            (advertiser1) => advertiser1.Username !== advertiser.Username
          )
        );
        //alert("Advertiser account deleted successfully!");
      }
    } catch (err) {
      setError("An error occurred while deleting the account");
      //alert("Error deleting account");
    }
  };

  const columns = [
    {
      key: "user",
      label: "Advertiser",
    },
    {
      key: "company",
      label: "Company",
    },
    {
      key: "website",
      label: "Website",
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
      <AdminNavBar />
      <Toaster />
      <br></br>
      <h1 className="text-3xl font-bold mb-6 ml-6">All Advertisers</h1>
      <Table>
        <TableHeader className="text-left">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {advertisers.map(
            (advertiser) => (
              console.log(advertiser),
              (
                <Fragment key={advertiser._id}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => toggleRow(advertiser._id)}
                          size="icon"
                          variant="outline"
                          color="secondary"
                          className="h-7 w-7 border-none rounded-full"
                        >
                          <Icon
                            icon="heroicons:chevron-down"
                            className={cn(
                              "h-5 w-5 transition-all duration-300",
                              {
                                "rotate-180": collapsedRows.includes(
                                  advertiser._id
                                ),
                              }
                            )}
                          />
                        </Button>
                        <div className="flex gap-3 items-center">
                          <Avatar className="rounded-full">
                            <AvatarImage
                              src={getImageSrc(advertiser.picture)}
                            />
                            <AvatarFallback>
                              {advertiser.Username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm block text-card-foreground">
                              {advertiser.Username}
                            </span>
                            <span className="text-xs mt-1 block font-normal">
                              {advertiser.Email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{advertiser.CompanyProfile}</TableCell>
                    <TableCell>
                      <a
                        href={advertiser.Website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {advertiser.Website}
                      </a>
                    </TableCell>
                    <TableCell className="flex items-center justify-start px-4 py-6">
                      <Button
                        size="icon"
                        variant="outline"
                        color="destructive"
                        className="h-7 w-7 border-none p-0"
                        onClick={() => deleteAdvertiser(advertiser)}
                      >
                        <Icon icon="heroicons:trash" className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {collapsedRows.includes(advertiser._id) && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="pl-12 flex flex-col items-start">
                          <p>Hotline: {advertiser.Hotline}</p>
                          <p>
                            Created At:{" "}
                            {new Date(
                              advertiser.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            Updated At:{" "}
                            {new Date(
                              advertiser.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            )
          )}
        </TableBody>
      </Table>
      <TourismGovernerFooter />
    </>
  );
};

export default AdvertiserTable;
