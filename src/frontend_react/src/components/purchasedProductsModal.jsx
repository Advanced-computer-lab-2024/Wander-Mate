'use client'

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { X } from 'lucide-react';
import { StarRating } from "../components/StarRating";
import { toast } from "react-hot-toast";

export default function PurchasedProductModal({
  product,
  isOpen,
  setIsOpen,
  children,
  myProductRating,
  mySellerRating,
  seller,
  reFetchRatings,
}) {
  const [productReviews, setProductReviews] = useState([]);
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
        const productResponse = await fetch(`/api/getProductReviews/${product._id}`);
        const productData = await productResponse.json();
        setProductReviews(productData);

        const sellerResponse = await fetch(`/api/getSellerReviews/${seller._id}`);
        const sellerData = await sellerResponse.json();
        setSellerReviews(sellerData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, product._id, seller._id]);

  const handleSubmitReview = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();

      if (productReview !== "") {
        const response = await fetch(`/api/reviewProduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
            userId: userID,
            review: productReview,
            username,
          }),
        });
        if (response.ok) {
          toast.success("Product review submitted successfully!");
          setProductReview("");
        }
      }

      if (sellerReview !== "") {
        const response = await fetch(`/api/reviewSeller`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sellerId: seller._id,
            userId: userID,
            review: sellerReview,
            username,
          }),
        });
        if (response.ok) {
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
      const response = await fetch("/api/rateProduct", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userID,
          productId: product._id,
          rating: rating,
        }),
      });
      if (!response.ok) throw new Error("Failed to rate product");
      setProductRating(rating);
      reFetchRatings(product._id);
    } catch (error) {
      console.error("Error rating product:", error);
      toast.error("Failed to rate product");
    }
  };

  const rateSeller = async (rating) => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      // const response = await fetch("/api/rateSeller", {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId: userID,
      //     sellerId: seller._id,
      //     rating: rating,
      //   }),
      // });
      // if (!response.ok) throw new Error("Failed to rate seller");
      // setSellerRating(rating);
      // reFetchRatings(seller._id);
    } catch (error) {
      console.error("Error rating seller:", error);
      toast.error("Failed to rate seller");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Price:</span> {product.price} {product.currency}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Seller:</span> {seller.name}
                </p>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>

            <Tabs defaultValue="product">
              <TabsList>
                <TabsTrigger value="product">Rate Product</TabsTrigger>
                <TabsTrigger value="seller">Rate Seller</TabsTrigger>
                <TabsTrigger value="product-reviews">Product Reviews</TabsTrigger>
                <TabsTrigger value="seller-reviews">Seller Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="product" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product-rating">Product Rating</Label>
                        <StarRating
                          rating={productRating}
                          onRatingChange={rateProduct}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-review">Product Review</Label>
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
                        <Label htmlFor="seller-rating">Seller Rating</Label>
                        <StarRating
                          rating={sellerRating}
                          onRatingChange={rateSeller}
                        />
                      </div>
                      <div>
                        <Label htmlFor="seller-review">Seller Review</Label>
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
              <TabsContent value="product-reviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {productReviews.length > 0 ? (
                      <ul className="space-y-4">
                        {productReviews.map((review, index) => (
                          <li key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">{review.username}</span>
                            </div>
                            <p className="text-gray-600">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No product reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="seller-reviews" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {sellerReviews.length > 0 ? (
                      <ul className="space-y-4">
                        {sellerReviews.map((review, index) => (
                          <li key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium">{review.username}</span>
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
              Submit Reviews
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

