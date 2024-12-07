import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const AllProductsAtAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/viewSellerProducts");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        // Filter and sort products by sales
        const sortedProducts = data.sort((a, b) => b.sales - a.sales); // Descending order by sales

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading popular products...</div>;
  }

  return (
    <Card>
      <CardHeader className="border-none flex-row mb-0">
        <div className="flex-1 pt-2">
          <CardTitle>Popular Products</CardTitle>
          <span className="block text-sm text-default-600 mt-2">
            Total{" "}
            {products.reduce((total, product) => total + product.sales, 0)}{" "}
            sales
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-1">
        <div className="h-[370px]">
          <ScrollArea className="h-full">
            {products.map((item, index) => (
              <div
                key={`popular-product-${index}`}
                className="px-4 py-1 flex gap-3 items-center mb-1.5 hover:bg-default-50"
              >
                <div className="w-11 h-11 rounded-md flex-none bg-default-100 dark:bg-default-200">
                  <img
                    src={`http://localhost:8000/products/${item._id}/image`}
                    alt="product image"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <a
                    href={item.link}
                    className="text-sm font-medium text-default-800 hover:text-primary"
                  >
                    {item.name}
                  </a>
                  <div className="text-xs text-default-400">
                    Sales: {item.sales}
                  </div>
                </div>
                <div className="flex-none text-sm font-medium text-default-700">
                  ${item.price}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllProductsAtAdmin;
