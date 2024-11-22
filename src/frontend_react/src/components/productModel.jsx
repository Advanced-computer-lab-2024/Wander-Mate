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

export default function ProductModal({
  product,
  isOpen,
  setIsOpen,
  children,
  quantity,
  isAdded: initialIsAdded,
  count: initialCount,
}) {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(initialIsAdded);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

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
    if (urlParams.get("open") === "true") {
      setIsOpen(true);
    }
  }, [isOpen, product.reviews]);

  const handleAddToCart = async () => {
    setIsAdded(true);
    if (!isInStock()) return;
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/addItemToCart`, {
        touristID: userID,
        productId: product.productId,
        name: product.name,
        price: product.price,
        picture: product.image,
      });
    } catch (error) {
      console.error("Error adding to cart data:", error);
    }
  };

  const handleNotifyMe = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const response = await axios.post(`http://localhost:8000/notifyMe`, {
        username,
        productId: product.productId,
      });
      toast("You will be notified when product is back in stock!", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#826AF9",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error signing up for notifications:", error);
    }
  };

  const incrementCount = async () => {
    if (count >= quantity) return;
    setCount((prevCount) => prevCount + 1);
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/addItemToCart`, {
        touristID: userID,
        productId: product.productId,
        name: product.name,
        price: product.price,
        picture: product.image,
      });
    } catch (error) {
      console.error("Error adding to cart data:", error);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
    if (count <= 1) {
      setCount(1);
      setIsAdded(false);
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
                      ${product.price}
                    </span>
                    {product.discount && (
                      <>
                        <span className="ml-2 text-lg line-through text-gray-500">
                          $
                          {(
                            product.price +
                            (product.price * product.discount) / 100
                          ).toFixed(2)}
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
                    {!isAdded ? (
                      <Button
                        className="flex-1"
                        onClick={isInStock() ? handleAddToCart : handleNotifyMe}
                      >
                        <Icon
                          icon={
                            isInStock()
                              ? "heroicons:shopping-bag"
                              : "heroicons:bell"
                          }
                          className="w-4 h-4 mr-2"
                        />
                        {isInStock()
                          ? "Add to Cart"
                          : "Notify Me When Available"}
                      </Button>
                    ) : (
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 h-10 flex border border-1 border-primary delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-primary rounded">
                          <button
                            type="button"
                            className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={decrementCount}
                          >
                            <Icon icon="eva:minus-fill" />
                          </button>

                          <div className="flex-1 text-base py-2 flex items-center min-w-[90px] justify-center text-primary font-medium">
                            {count}
                          </div>
                          <button
                            type="button"
                            className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={incrementCount}
                            disabled={count >= quantity}
                          >
                            <Icon icon="eva:plus-fill" />
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          className="py-2 px-5 flex-none"
                          onClick={goToCart}
                        >
                          <Icon
                            icon="heroicons:shopping-bag"
                            className="w-4 h-4"
                          />
                          Added
                        </Button>
                      </div>
                    )}
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
