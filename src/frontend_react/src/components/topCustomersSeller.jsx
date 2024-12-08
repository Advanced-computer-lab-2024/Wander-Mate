import React, { useEffect, useState } from "react";
import DashboardDropdown from "./dashboard-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ListItem from "./list-item.jsx";
import CustomerCard from "./customer-card";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import CustomerCardSeller from "./customerCardSeller";
import ListItemSeller from "./listItemSeller";

const TopCustomersSeller = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const response = await fetch(
          `http://localhost:8000/getTopCustomersSeller/${userID}`
        ); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log(result);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="flex-row justify-between items-center gap-4 mb-0 border-none p-6">
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 ">
          <div className="pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
              {data.slice(0, 3).map((item, index) => (
                <CustomerCardSeller
                  key={item._id}
                  item={item}
                  index={index + 1}
                />
              ))}
            </div>
            <div className="mt-8 ">
              {data.slice(3).map((item, index) => (
                <ListItemSeller
                  key={`customer-${item._id}`}
                  item={item}
                  index={index + 4} // Adjust index for proper ordering
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default TopCustomersSeller;
