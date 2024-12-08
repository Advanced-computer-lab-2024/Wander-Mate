"use client";

import { useState, useEffect } from "react";
import EditableProductCard from "../components/editableProductCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "../components/ui/button";
import AddProductSellerModal from "../components/AddProductSellerModal";
import SellerNavBar from "../components/sellerNavBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortCriteria, setSortCriteria] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const sellerId = userID;
      if (!sellerId) {
        console.error("Seller ID not found in session storage");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/viewSellerProducts");
      if (response.ok) {
        const products = await response.json();
        console.log(products);
        const sellerProducts = products.filter(
          (product) => product.seller === sellerId
        );
        setAllProducts(sellerProducts);
        setFilteredProducts(sellerProducts);
      } else {
        console.error("Failed to fetch products:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = () => {
    let updatedProducts = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.price >= minPrice &&
          product.price <= maxPrice
      )
      .sort((a, b) => {
        if (sortCriteria === "rating") {
          return sortOrder === "asc"
            ? a.ratings - b.ratings
            : b.ratings - a.ratings;
        }
        if (sortCriteria === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, minPrice, maxPrice, sortCriteria, sortOrder, allProducts]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (value) => setSortCriteria(value);
  const handleSortOrderToggle = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(value);
    setPriceRange([value, maxPrice]);
  };
  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    setPriceRange([minPrice, value]);
  };

  return (
    <>
      <SellerNavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Products</h1>
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              {/* Modal Trigger */}
              <AddProductSellerModal />
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-64">
                  <Label
                    htmlFor="price-range"
                    className="text-sm font-medium mb-2 block"
                  >
                    Price Range
                  </Label>
                  <Slider
                    id="price-range"
                    value={priceRange}
                    max={10000}
                    step={1}
                    onValueChange={handlePriceRangeChange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      className="w-20 text-right"
                    />
                    <Input
                      type="number"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      className="w-20 text-right"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <Label
                      htmlFor="sort-criteria"
                      className="text-sm font-medium mb-2 block"
                    >
                      Sort by
                    </Label>
                    <Select
                      onValueChange={handleSortChange}
                      defaultValue={sortCriteria}
                    >
                      <SelectTrigger id="sort-criteria" className="w-[120px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSortOrderToggle}
                    className="mt-6"
                  >
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortOrder === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ECommerceDefaultSkeleton key={index} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <EditableProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                description={product.description}
                price={product.price}
                seller={product.seller || "Unknown"}
                ratings={product.ratings}
                reviews={product.reviews}
                image={`http://localhost:8000/products/${product._id}/image`}
                quantity={product.quantity}
                discount={product.discount}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found
            </p>
          )}
        </div>
      </div>
      <TourismGovernerFooter />
    </>
  );
}
