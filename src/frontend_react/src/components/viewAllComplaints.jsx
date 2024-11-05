import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../src/components/ui/table"; // adjust the import path as needed

const ViewAllComplaints = () => {
  // Example data, you can replace this with your actual data source
  const complaints = [
    { id: 1, name: "John Doe", issue: "Late delivery", status: "Resolved" },
    { id: 2, name: "Jane Smith", issue: "Damaged item", status: "Pending" },
    { id: 3, name: "Sam Wilson", issue: "Incorrect order", status: "In Progress" },
  ];

  return (
    <div className="p-4">
      <Table wrapperClass="my-4">
        <TableCaption>List of all complaints</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.name}</TableCell>
              <TableCell>{complaint.issue}</TableCell>
              <TableCell>{complaint.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Showing {complaints.length} complaints
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ViewAllComplaints;
