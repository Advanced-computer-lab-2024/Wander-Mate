"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ECommerceDefaultSkeleton from "./ECommerceDefaultSkeleton";
import BoughtProductCard from "./boughtProductCard";

export default function BoughtProducts() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 2,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [userid, setUserid] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("Username not found in session storage");

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserid(userID);

        // Fetch unique bought products
        const response = await fetch(
          `http://localhost:8000/viewBoughtProducts/${userID}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log(data);

        const mappedProducts = data.map((product) => ({
          productId: product._id,
          name: product.name || "Unknown Product",
          image: `http://localhost:8000/products/${product._id}/image`,
          price: product.price || 0,
          currency: product.currency || "USD",
          rating: product.ratings || 0,
          description: product.description || "No description available",
          quantity: product.quantity || 1,
          BookedDate: product.date || "Unknown booking date",
          isPaid: product.isPaid || false,
          total: product.total || 0,
          status: product.status || "Pending",
          sellerId: product.seller._id,
          sellerName: product.seller.FullName,
          sellerUsername: product.seller.Username,
          sellerEmail: product.seller.Email,
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };

      emblaApi.on("select", onSelect);
      onSelect();

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);
  useEffect(() => {
    // Fetch all ratings when itineraries are fetched
    products.forEach((product) => {
      getMyRating(product.productId);
      //   getMyRating(product.sellerId);
    });
  }, [products, userid]); // Runs when itineraries or userId change
  const [ratings, setRatings] = useState({});

  const getMyRating = async (productId) => {
    try {
      const reply = await fetch(
        `http://localhost:8000/getMyRating/${userid}/${productId}`
      );
      console.log(reply);
      if (!reply.ok) throw new Error("Failed to get rating");
      const data = await reply.json(); // Get the rating from the response
      setRatings((prevRatings) => ({
        ...prevRatings,
        [productId]: data.rating, // Store the rating by itineraryId
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Bought Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <ECommerceDefaultSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bought Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous products"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next products"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {products.map(
            (item) => (
              console.log(ratings[item.productId]),
              (
                <div
                  key={item.productId}
                  className="flex-shrink-0 w-full md:w-1/2 px-2"
                >
                  <BoughtProductCard
                    {...item}
                    myProductRating={ratings[item.productId]}
                    mySellerRating={ratings[item.sellerId] || 0}
                    reFetchratings={getMyRating}
                  />
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
