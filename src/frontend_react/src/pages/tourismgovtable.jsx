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

const TourismGovTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [tourismGovs, setTourismGovs] = useState([]); // Store tourism governor data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTourismGovs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/gettourismgov");
        console.log(response.data); // Check response data structure
        setTourismGovs(response.data); // Store tourism governor data
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchTourismGovs();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "updatedAt",
      label: "Updated At",
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
    // If you have an image or avatar system, modify accordingly
    return null;
  };

  return (
    <Table>
      <TableHeader className="text-left">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tourismGovs.map((tourismGov) => (
          <Fragment key={tourismGov._id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-full">
                      <AvatarImage src={getImageSrc(tourismGov.picture)} />
                      <AvatarFallback>{tourismGov.Username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm block text-card-foreground">
                        {tourismGov.Username}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{new Date(tourismGov.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(tourismGov.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="flex items-center justify-start px-4 py-6">
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7 border-none p-0"
                >
                  <Icon icon="heroicons:trash" className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default TourismGovTable;
