import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Toaster, toast } from "react-hot-toast";
import {
  CustomPopover as Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AdminProductModal({
  product,
  isOpen,
  setIsOpen,
  children,
  quantity,
  isAdded: initialIsAdded,
  count: initialCount,
  isAuthenticated,
  isArchiveded,
}) {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(initialIsAdded);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(isArchiveded);

  const goToCart = () => {
    navigate("/cart");
  };

  const handleSellerClick = (e) => {
    e.preventDefault();
    if (seller && seller.seller) {
      navigate("/productSeller", { state: { sellerId: seller.seller._id } });
    }
  };

  useEffect(() => {
    setCount(initialCount);
    setIsAdded(initialIsAdded);
  }, [initialCount, initialIsAdded]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        console.log(product);
        const response = await axios.get(
          `http://localhost:8000/getSellerById/${product.seller}`
        );
        setSeller(response.data);
      } catch (error) {
        console.error("Error fetching seller information:", error);
      }
    };

    if (product.seller) {
      fetchSellerInfo();
    }
  }, [product.seller]);

  const getInitials = (name) => {
    if (!name) return "SS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      const url = new URL(window.location.href);
      if (window.location.search.includes("open")) {
        url.searchParams.delete("open");
        url.searchParams.delete("product");
        window.history.replaceState({}, "", url);
        window.location.reload();
      }
    }
  };

  const isInStock = () => quantity > 0;

  useEffect(() => {
    const fetchReviews = async () => {
      if (product.reviews && product.reviews.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:8000/getReviews",
            {
              reviewIds: product.reviews,
            }
          );

          setReviews(response.data.reviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    if (isOpen) {
      fetchReviews();
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("open") === "true" &&
      urlParams.get("product") === product.productId
    ) {
      setIsOpen(true);
    }
  }, [isOpen, product.reviews]);

  const handleArchiveProduct = async () => {
    try {
      const isArchived = !current; // Toggle the archived status
      const response = await axios.patch(
        `http://localhost:8000/AdminarchiveProduct/${product.productId}`,
        { isArchived }
      );

      if (response.data.product) {
        setIsAdded(true); // Set the button as "added" once the product is archived
        toast(
          `Product has been ${
            isArchived ? "archived" : "unarchived"
          } successfully!`,
          {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#826AF9",
              color: "#fff",
            },
          }
        );
      }
      setCurrent(!current);
    } catch (error) {
      console.error("Error archiving/unarchiving product:", error);
      toast("Failed to archive/unarchive product", {
        icon: "🚨",
        style: {
          borderRadius: "10px",
          background: "#E53E3E",
          color: "#fff",
        },
      });
    }
  };

  const handleShare = (method) => {
    const currentUrl = window.location.href.split("?")[0];
    const shareUrl = `${currentUrl}?open=true&product=${product.productId}`;
    const shareText = `Check out this amazing product: ${product.name}`;

    if (method === "link") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast("Link copied to Clipboard!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#826AF9",
            color: "#fff",
          },
        });
        setIsShareOpen(false);
      });
    } else if (method === "email") {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        shareText
      )}&body=${encodeURIComponent(shareUrl)}`;
      window.location.href = mailtoLink;
      setIsShareOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <Toaster />
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={() => handleOpenChange(false)}
          >
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>
          <div className="space-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        icon="ph:star-fill"
                        className={`w-5 h-5 ${
                          i < Math.floor(product.ratings)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.ratings})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">
                      $
                      {product.discount > 0
                        ? product.price -
                          (product.price * product.discount) / 100
                        : product.price}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="ml-2 text-lg line-through text-gray-500">
                          ${product.price}
                        </span>
                        <span className="ml-2 text-lg font-semibold text-green-600">
                          {product.discount}% Off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Availability:</span>{" "}
                      <span
                        className={`text-sm ${
                          isInStock()
                            ? "text-gray-500"
                            : "text-red-500 font-semibold"
                        }`}
                      >
                        {quantity !== 0
                          ? `${quantity} in stock`
                          : "Out of stock"}
                      </span>
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

                  <p className="text-gray-600 mb-6">{product.description}</p>

                  {/* Add to Cart Button and Share Button */}
                  <div className="flex space-x-4 mb-6">
                    {/* Replace the Add to Cart / Notify Me Button with Archive Button */}

                    <Button
                      className="flex-1"
                      onClick={handleArchiveProduct} // Use the new archive function
                    >
                      <Icon
                        icon={
                          current ? "heroicons:archive" : "heroicons:unarchive"
                        }
                        className="w-4 h-4 mr-2"
                      />
                      {current ? "Unarchive" : "Archive"}
                    </Button>

                    <Popover
                      open={isShareOpen}
                      onOpenChange={setIsShareOpen}
                      onClose={() => setIsShareOpen(false)}
                      trigger={
                        <Button
                          variant="outline"
                          onClick={() => setIsShareOpen(true)}
                        >
                          <Icon
                            icon="heroicons:share"
                            className="w-4 h-4 mr-2"
                          />
                          Share
                        </Button>
                      }
                    >
                      <div className="w-48 p-2">
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("link")}
                            className="w-full justify-start"
                          >
                            <Icon
                              icon="heroicons:link"
                              className="w-4 h-4 mr-2"
                            />
                            Copy Link
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("email")}
                            className="w-full justify-start"
                          >
                            <Icon
                              icon="heroicons:envelope"
                              className="w-4 h-4 mr-2"
                            />
                            Email
                          </Button>
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info">Product Information</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    {seller && seller.seller && (
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="font-semibold text-sm text-gray-600">
                          Seller:
                        </span>
                        <a
                          href="#"
                          onClick={handleSellerClick}
                          className="flex items-center space-x-2 hover:text-primary transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getImageSrc(seller.seller.picture)}
                              alt={seller.seller.FullName}
                            />
                            <AvatarFallback>
                              {getInitials(seller.seller.FullName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {seller.seller.FullName}
                          </span>
                        </a>
                      </div>
                    )}
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
  );
}
