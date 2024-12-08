"use client";

import React, { useState } from "react";
import { Star, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>View Product</Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          size="full"
        >
          <div className="relative">
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="space-y-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src="/placeholder.svg?height=600&width=600"
                    alt="Nike Airmax 270 React"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Nike Airmax 270 React
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <Star className="w-5 h-5 text-gray-300" />
                      <span className="ml-2 text-sm text-gray-600">(4.0)</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-blue-600">
                        $299.43
                      </span>
                      <span className="ml-2 text-lg line-through text-gray-500">
                        $534.33
                      </span>
                      <span className="ml-2 text-lg font-semibold text-green-600">
                        24% Off
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Availability:</span> In
                        Stock
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        Accessories
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Shipping:</span> Free
                        Shipping
                      </p>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-2">
                        Select Color:
                      </p>
                      <div className="flex space-x-2">
                        {[
                          "bg-blue-500",
                          "bg-red-500",
                          "bg-black",
                          "bg-yellow-500",
                        ].map((color, index) => (
                          <button
                            key={index}
                            className={`w-8 h-8 ${color} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-6">
                      <label
                        htmlFor="size"
                        className="block text-sm font-semibold mb-2"
                      >
                        Size:
                      </label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["XS", "S", "M", "L", "XL"].map((size) => (
                            <SelectItem key={size} value={size.toLowerCase()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <Button className="w-full">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add To Cart
                  </Button>
                </div>
              </div>

              {/* Product Description Tabs */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="info">Product Information</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600">
                        Air max are always very comfortable fit, clean and just
                        perfect in every way. Just the box was too small and
                        scrunched the sneakers up a little bit, not sure if the
                        box was always this small but the 90s are and will
                        always be one of my favorites.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600">No reviews yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="shipping" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600">
                        Free shipping on all orders over $100. Returns accepted
                        within 30 days of purchase.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <TourismGovernerFooter />
    </React.Fragment>
  );
}
