import { Fragment } from "react";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import axios from "axios";
import { useState, useEffect } from "react";

const ViewAllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/viewAllComplaints"
        );
        if (response.status === 200) {
          console.log(response);
          setComplaints(response.data.complaints);
        } else {
          setError("No complaints found.");
        }
      } catch (err) {
        setError("Failed to fetch complaints.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
    console.log(complaints);
  }, []);
  return (
    <Fragment>
      <DataTable data={complaints} columns={columns} />
    </Fragment>
  );
};

export default ViewAllComplaints;
