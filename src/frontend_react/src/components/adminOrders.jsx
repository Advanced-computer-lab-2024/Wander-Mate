"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import OrdersTable from "./allOrdersTable";
import AdminNavBar from "./AdminNavBar";
const Orders = () => {
  return (
    <><AdminNavBar/>
    <Card>
      <CardHeader className="mb-0 p-6">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <OrdersTable />
      </CardContent>
    </Card>
    </>
  );
};

export default Orders;
