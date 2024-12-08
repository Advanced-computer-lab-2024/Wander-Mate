import React, { useEffect, useState } from "react";
import DashboardDropdown from "./dashboard-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ListItem from "./list-item.jsx";
import CustomerCard from "./customer-card";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const TopUsers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/viewTopUsers"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log(result);
        setData(result);
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
          <CardTitle>Top Sellers</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 ">
          <div className="pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
              {data
                .slice(0, 3)
                .map(
                  (item, index) => (
                    console.log(item),
                    (
                      <CustomerCard
                        key={item._id}
                        item={item}
                        index={index + 1}
                      />
                    )
                  )
                )}
            </div>
            <div className="mt-8 ">
              {data.slice(3).map((item, index) => (
                <ListItem
                  key={`customer-${item._id}`}
                  item={item}
                  index={index + 4} // Adjust index for proper ordering
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default TopUsers;
