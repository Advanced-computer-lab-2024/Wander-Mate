import { Fragment } from "react";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import axios from "axios";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton"; // You can install this package
import AdminNavBar from "./AdminNavBar";
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
          const complaintsData = response.data.complaints;

          // Fetch user data for each complaint
          const userCache = {}; // Cache to avoid duplicate API calls
          const enrichedComplaints = await Promise.all(
            complaintsData.map(async (complaint) => {
              if (!userCache[complaint.userId]) {
                const userResponse = await axios.get(
                  `http://localhost:8000/getUsername/${complaint.Maker}`
                );

                userCache[complaint.userId] = userResponse.data;
              }
              return {
                ...complaint,
                userName: userCache[complaint.userId],
              };
            })
          );


          setComplaints(enrichedComplaints);
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
  }, []);

  if (loading) {
    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              {/* Skeleton loader for table headers */}
              {Array(5)
                .fill()
                .map((_, idx) => (
                  <th key={idx}>
                    <Skeleton width={100} height={20} />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {/* Skeleton loader for table rows */}
            {Array(5)
              .fill()
              .map((_, idx) => (
                <tr key={idx}>
                  {Array(5)
                    .fill()
                    .map((_, colIdx) => (
                      <td key={colIdx}>
                        <Skeleton width={120} height={20} />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </Fragment>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <Fragment>
      <AdminNavBar/>
      <br/>
      <br/>
      
      <DataTable data={complaints} columns={columns} />
    </Fragment>
  );
};

export default ViewAllComplaints;
