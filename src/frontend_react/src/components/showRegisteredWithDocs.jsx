import { Fragment } from "react";
import { columns } from "./documentsTable/docs-columns";
import { DocsTable } from "./documentsTable/docs-table";
import axios from "axios";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton"; // You can install this package

const ViewAllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/viewDocuments");
        if (response.status === 200) {
          const documentsData = response.data.documents;

          // // Check if documentsData is an object with ownerIds as keys
          // if (typeof documentsData === "object") {
          //   // Convert the object to an array of documents with ownerId included
          //   const flattenedDocuments = Object.entries(documentsData).flatMap(
          //     ([ownerId, documents]) =>
          //       documents.map((doc) => ({
          //         ...doc,
          //         ownerId, // Attach the ownerId to each document
          //       }))
          //   );

          //   console.log(flattenedDocuments);

          // } else {
          //   setError("Unexpected data format.");
          // }
          console.log(documentsData);
          setDocuments(documentsData); // Update state with flattened documents
        } else {
          setError("No documents found.");
        }
      } catch (err) {
        setError("Failed to fetch documents.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
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
      <DocsTable data={documents} columns={columns} />
    </Fragment>
  );
};

export default ViewAllDocuments;
