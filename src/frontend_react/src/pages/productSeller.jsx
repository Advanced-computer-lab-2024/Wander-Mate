import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";
import ProductCard from "../components/productCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Skeleton } from "../components/ui/skeleton";
import NavigationMenuBar from "../components/NavigationMenuBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function SellerPage() {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const sellerId = location.state?.sellerId;

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortCriteria, setSortCriteria] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchData = async () => {
      if (sellerId) {
        try {
          setIsLoading(true);
          const [sellerResponse, productsResponse] = await Promise.all([
            axios.get(`http://localhost:8000/getSellerById/${sellerId}`),
            axios.get("http://localhost:8000/viewSellerProducts"),
          ]);

          setSellerInfo(sellerResponse.data.seller);
          const sellerProducts = productsResponse.data.filter(
            (product) => product.seller === sellerId
          );
          setAllProducts(sellerProducts);
          setFilteredProducts(sellerProducts);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            "Failed to load seller information and products. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("No seller ID provided. Please go back and try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, minPrice, maxPrice, sortCriteria, sortOrder, allProducts]);

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

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
      const base64String =
        typeof picture.data === "string"
          ? picture.data
          : btoa(String.fromCharCode.apply(null, new Uint8Array(picture.data)));
      return `data:${picture.contentType};base64,${base64String}`;
    }
    return null;
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  };

  const SellerInfoSkeleton = () => (
    <Card className="mb-8">
      <CardContent className="flex items-center space-x-4 pt-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <NavigationMenuBar />
      <div className="container mx-auto p-4">
        {isLoading ? (
          <SellerInfoSkeleton />
        ) : (
          <Card className="mb-8">
            <CardContent className="flex items-center space-x-4 pt-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={getImageSrc(sellerInfo.picture)}
                  alt={sellerInfo.FullName}
                />
                <AvatarFallback>
                  {getInitials(sellerInfo.FullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{sellerInfo.FullName}</h1>
                <p className="text-gray-500">{sellerInfo.email}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-xl font-bold mb-6">Seller's Products</h2>
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
                    max={1000}
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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ECommerceDefaultSkeleton key={index} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
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
