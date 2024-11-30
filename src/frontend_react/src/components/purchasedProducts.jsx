'use client'

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PurchasedProductCard from "./purchasedProductsCard";
import { Skeleton } from "./ui/skeleton";

export default function PurchasedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState(0);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`/api/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get user ID");

        const { userID } = await reply.json();
        setUserid(userID);
        const response = await fetch(`/api/viewPurchasedProducts/${userID}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      getMyRating(product._id);
      getMyRating(product.seller._id);
    });
  }, [products, userid]);

  const getMyRating = async (productId) => {
    try {
      const reply = await fetch(`/api/getMyRating/${userid}/${productId}`);
      if (!reply.ok) throw new Error("Failed to get rating");
      const data = await reply.json();
      setRatings((prevRatings) => ({
        ...prevRatings,
        [productId]: data.rating,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Purchased Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchased Products</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <PurchasedProductCard
            key={product._id}
            productId={product._id}
            name={product.name}
            images={product.images}
            price={product.price}
            currency={product.currency || "USD"}
            rating={product.ratings}
            description={product.description}
            seller={product.seller}
            totalRatings={product.sales}
            myProductRating={ratings[product._id]}
            mySellerRating={ratings[product.seller._id]}
            reFetchRatings={getMyRating}
          />
        ))}
      </div>
    </div>
  );
}

