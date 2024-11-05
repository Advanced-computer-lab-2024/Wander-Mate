import { Card } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";

const ProductCard = ({
  name, // add the name prop here
  image,
  title,
  description,
  price,
  discount,
  category,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [count, setCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
  };

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
    if (count <= 1) {
      setCount((prevCount) => 1);
      setIsAdded(false);
    }
  };

  return (
    <Card className="p-4 rounded-md">
      <div className="relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
        <div className="w-full overflow-hidden rounded-md relative z-10 bg-default-100 dark:bg-default-200 h-full group">
          <img
            alt={title}
            className="h-full w-full object-contain p-6 transition-all duration-300 group-hover:scale-105"
            src={image}
          />
          {discount && (
            <Badge
              color="destructive"
              className="absolute top-3 ltr:left-3 rtl:right-3"
            >
              -{discount}%
            </Badge>
          )}
          <div className="hover-box flex flex-col invisible absolute top-3 right-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 space-y-[6px]">
            <button
              className="rounded-full bg-background p-2"
              onClick={handleLike}
            >
              <Icon
                icon={isLiked ? "ph:heart-fill" : "ph:heart"} // Change icon based on liked state
                className={`h-4 w-4 ${
                  isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-secondary-foreground uppercase font-normal">
            {category}
          </p>
          <span className="flex items-center text-secondary-foreground font-normal text-xs gap-x-1">
            <Icon icon="ph:star-fill" className="text-yellow-400" />
            <span>4.8</span>
          </span>
        </div>
        <h6 className="text-secondary-foreground text-base font-medium mb-[6px] truncate">
          {title}
        </h6>
        
        {/* Add the name in bold above the description */}
        <p className="font-bold text-base mb-2">{name}</p>
        
        <p className="text-default-500 dark:text-default-500 text-sm font-normal mb-2">
          {description}
        </p>
        
        <p className="mb-4 space-x-4">
          <span className="text-secondary-foreground text-base font-medium mt-2">
            ${price}
          </span>
          {discount && (
            <del className="text-default-500 dark:text-default-500 font-normal text-base">
              ${price + (price * discount) / 100}
            </del>
          )}
        </p>

        {!isAdded ? (
          <Button
            className="w-full"
            variant="outline"
            onClick={handleAddToCart}
          >
            <Icon
              icon="heroicons:shopping-bag"
              className="w-4 h-4 ltr:mr-2 rtl:ml-2"
            />
            Add to Cart
          </Button>
        ) : (
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 h-10 flex border border-1 border-primary delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-primary rounded">
              <button
                type="button"
                className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={decrementCount}
              >
                <Icon icon="eva:minus-fill" />
              </button>

              <div className="flex-1 text-base py-2 flex items-center min-w-[45px] justify-center text-primary font-medium">
                {count}
              </div>
              <button
                type="button"
                className="flex-none px-4 text-primary hover:bg-primary hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={incrementCount}
              >
                <Icon icon="eva:plus-fill" />
              </button>
            </div>
            <Button variant="outline" className="py-2 px-5 flex-none">
              <Icon icon="heroicons:shopping-bag" className="w-4 h-4" />
              Added
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
