"use client";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react";
const CustomerCardSeller = ({ item, index }) => {
  const { score, picture, color, amountPaid, Username } = item;

  return (
    <>
      <div
        className={cn({
          "order-2 md:-mt-8": index === 1,
          "order-1": index === 2,
          "order-3": index === 3,
        })}
      >
        <div className={`bg-${color}/10  relative p-6 pt-12 rounded`}>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 ">
            <div className="relative inline-block ring ring-yellow-400 rounded-full">
              {index === 1 && (
                <span className="absolute -top-[29px] left-1/2 -translate-x-1/2  ">
                  <Icon
                    icon="ph:crown-simple-fill"
                    className="h-10 w-10 text-yellow-400"
                  />
                </span>
              )}
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {item.fullName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Badge className="w-[18px] h-[18px] bg-warning/90 text-[10px] font-semibold p-0  items-center justify-center   absolute left-[calc(100%-14px)] top-[calc(100%-20px)] bg-yellow-400">
                {index}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 ">
            <div className="text-base font-semibold text-default-900 mb-1 whitespace-nowrap">
              {item.fullName || item.user.Username}
            </div>
            <div>
                {item.email}
            </div>
            <Badge className="bg-primary/80">${amountPaid}</Badge>
          </div>

          {/* <div className="flex-none w-full mt-4">
            <div className="w-full">
              <div className="flex justify-between items-center gap-2 mb-1">
                <span className="text-xs font-medium text-default-800">
                  Score
                </span>
                <span className="text-xs font-medium text-default-900">
                  {score}%
                </span>
              </div>
              <Progress value={score} size="sm" color={color} />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CustomerCardSeller;
