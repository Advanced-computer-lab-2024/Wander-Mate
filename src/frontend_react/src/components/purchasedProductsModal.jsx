import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X } from 'lucide-react';
import { StarRating } from "./star-rating";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function PurchasedProductsModal({
  product,
  isOpen,
  setIsOpen,
  children,
  myProductRating,
  mySellerRating,
  seller,
  reFetchRatings,
}) {
  const [reviews, setReviews] = useState([]);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [productRating, setProductRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);
  const [productReview, setProductReview] = useState("");
  const [sellerReview, setSellerReview] = useState("");

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  useEffect(() => {
    setProductRating(myProductRating);
    setSellerRating(mySellerRating);
  }, [isOpen]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getProductReviews/${product._id}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchSellerReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getSellerReviews/${seller._id}`
        );
        const data = await response.json();
        console.log(data);
        setSellerReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (isOpen) {
      fetchReviews();
      fetchSellerReviews();
    }
  }, [isOpen, product.ratings]);

  const handleSubmitReview = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      if (productReview !== "") {
        const response = await axios.post(
          `http://localhost:8000/reviewProduct`,
          {
            productId: product._id,
            userId: userID,
            review: productReview,
            username,
          }
        );
        if (response.status === 200) {
          toast.success("Product review submitted successfully!");
          setProductReview("");
        }
      }
      if (sellerReview !== "") {
        const response = await axios.post(
          `http://localhost:8000/reviewSeller`,
          {
            sellerId: seller._id,
            userId: userID,
            review: sellerReview,
            username,
          }
        );
        if (response.status === 200) {
          toast.success("Seller review submitted successfully!");
          setSellerReview("");
        }
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const rateProduct = async (rating) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/rateProduct", {
        userId: userID,
        productId: product._id,
        rating: rating,
      });
      if (!response.status === 200) throw new Error("Failed to rate product");
      setProductRating(rating);
      reFetchRatings(product._id);
    } catch {
      console.log("Error");
    }
  };

  const rateSeller = async (rating) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/rateSeller", {
        userId: userID,
        sellerId: seller._id,
        rating: rating,
      });
      if (!response.status === 200) throw new Error("Failed to rate seller");
      setSellerRating(rating);
      reFetchRatings(seller._id);
    } catch {
      console.log("Error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Price:</span> ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Seller:</span> {seller.Username}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Description:</span> {product.description}
                </p>
              </div>
            </div>

            <Tabs defaultValue="product">
              <TabsList>
                <TabsTrigger value="product">Rate Product</TabsTrigger>
                <TabsTrigger value="seller">Rate Seller</TabsTrigger>
                <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
                <TabsTrigger value="sellerReviews">
                  Seller Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="product" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product-rating">
                          Product Rating
                        </Label>
                        <StarRating
                          rating={productRating}
                          onRatingChange={rateProduct}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-review">
                          Product Review
                        </Label>
                        <Textarea
                          id="product-review"
                          placeholder="Share your thoughts about the product..."
                          value={productReview}
                          onChange={(e) => setProductReview(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="seller" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="seller-rating">
                          Seller Rating
                        </Label>
                        <StarRating
                          rating={sellerRating}
                          onRatingChange={rateSeller}
                        />
                      </div>
                      <div>
                        <Label htmlFor="seller-review">
                          Seller Review
                        </Label>
                        <Textarea
                          id="seller-review"
                          placeholder="Share your thoughts about the seller..."
                          value={sellerReview}
                          onChange={(e) => setSellerReview(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {reviews.length > 0 ? (
                      <ul className="space-y-4">
                        {reviews.map((review, index) => (
                          <li
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">
                                {review.username}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sellerReviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {sellerReviews.length > 0 ? (
                      <ul className="space-y-4">
                        {sellerReviews.map((review, index) => (
                          <li
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">
                                {review.username}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No seller reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Button className="w-full" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

