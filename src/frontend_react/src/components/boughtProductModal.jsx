import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X } from "lucide-react";
import { StarRating } from "./StarRating";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

export default function BoughtProductModal({
  product,
  isOpen,
  setIsOpen,
  children,
  myProductRating,
  mySellerRating,
  reFetchratings,
}) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(myProductRating);
  const [review, setReview] = useState("");

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setRating(myProductRating);

      try {
        const response = await fetch(
          `http://localhost:8000/getProductReviews/${product._id}`
        );
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, product._id]);

  const handleSubmitReview = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Username not found in session storage");

      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/reviewProduct`, {
        productId: product._id,
        username,
        review,
        userId: userID,
      });
      if (response.status === 200) {
        toast.success("Review submitted successfully!");
        setReview("");
        setRating(0);
      }
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
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post("http://localhost:8000/rateProduct", {
        userId: userID,
        productId: product._id,
        rating: rating,
      });
      if (!response.status === 200) throw new Error("Failed to rate product");
      setRating(rating);
      reFetchratings(product._id);
    } catch (error) {
      console.log(error);
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
                  className="h-full w-full object-contain p-6 transition-all duration-300 group-hover:scale-105"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Price:</span>{" "}
                  {`${product.price} ${product.currrn}`}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Seller:</span>{" "}
                  {product.sellerName || product.sellerUsername}
                </p>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>

            <Tabs defaultValue="review">
              <TabsList>
                <TabsTrigger value="review">Review product</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="review" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product-rating">Product Rating</Label>
                        <StarRating
                          rating={rating}
                          onRatingChange={rateProduct}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-review">Product Review</Label>
                        <Textarea
                          id="product-review"
                          placeholder="Share your thoughts about the product..."
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
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
                                {review.username}{" "}
                                {/* Ensure you're accessing the right property */}
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
