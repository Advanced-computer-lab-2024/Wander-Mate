import React, { Fragment, useState, useEffect } from "react";
import { columns } from "./documentsTable/docs-columns";
import { DocsTable } from "./documentsTable/docs-table";
import axios from "axios";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

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
          console.log(documentsData);
          setDocuments(documentsData);
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
    return <LoadingSkeleton />;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Fragment>
      <DocsTable data={documents} columns={columns} />
    </Fragment>
  );
};

const LoadingSkeleton = () => {
  return (
    <React.Fragment>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {Array(5)
                  .fill(null)
                  .map((_, idx) => (
                    <th
                      key={idx}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                    >
                      <div className="h-4 w-3/4 animate-pulse bg-gray-200 rounded"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {Array(5)
                .fill(null)
                .map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {Array(5)
                      .fill(null)
                      .map((_, colIdx) => (
                        <td key={colIdx} className="p-4 align-middle">
                          <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default ViewAllDocuments;
