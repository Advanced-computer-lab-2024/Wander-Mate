"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Icon } from "@iconify/react";
import { Checkbox } from "../components/ui/checkbox";
import { useMediaQuery } from "../hooks/use-media-query";

const SiteLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    <circle cx="50" cy="50" r="40" fill="#4CAF50" />
    <text x="50" y="55" fontSize="20" textAnchor="middle" fill="#fff">
      Logo
    </text>
  </svg>
);
const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Your email is invalid." }),
  password: z.string().min(4),
});

const RegForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const navigate = useNavigate(); // Initialize useNavigate

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "text" ? "password" : "text"));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    startTransition(async () => {
      // Here you would typically call your user registration API
      // Assuming you have a function like addUser to handle registration
      // const response = await addUser(data);
      const response = {
        status: "success",
        message: "Registration successful!",
      }; // Placeholder response
      if (response?.status === "success") {
        toast.success(response?.message);
        reset();
        navigate("/"); // Redirect to home or login page after successful registration
      } else {
        toast.error(response?.message);
      }
    });
  };

  return (
    <div className="w-full">
      <button onClick={() => navigate("/dashboard")} className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </button>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Create an account to start using DashTail
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-default-600 mb-3">
              Full Name
            </Label>
            <Input
              disabled={isPending}
              id="name"
              type="text"
              size={!isDesktop2xl ? "xl" : "lg"}
              {...register("name")}
              className={cn("", {
                "border-destructive": errors.name,
              })}
            />
            {errors.name && (
              <div className="text-destructive mt-2">{errors.name.message}</div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-default-600 mb-3">
              Email
            </Label>
            <Input
              disabled={isPending}
              id="email"
              type="email"
              size={!isDesktop2xl ? "xl" : "lg"}
              {...register("email")}
              className={cn("", {
                "border-destructive": errors.email,
              })}
            />
            {errors.email && (
              <div className="text-destructive mt-2">
                {errors.email.message}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="text-default-600 mb-3">
              Password
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                id="password"
                type={passwordType}
                size={!isDesktop2xl ? "xl" : "lg"}
                {...register("password")}
                className={cn("", {
                  "border-destructive": errors.password,
                })}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <div className="text-destructive mt-2">
                {errors.password.message}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-5 mb-6">
          <Checkbox
            size="sm"
            className="border-default-300 mt-[1px]"
            id="terms"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
          >
            You accept our Terms & Conditions
          </Label>
        </div>
        <Button className="w-full" disabled={isPending} size="lg">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Registering..." : "Create an Account"}
        </Button>
      </form>

      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Already Registered?{" "}
        <button
          onClick={() => navigate("/auth/login2")}
          className="text-primary"
          type="button"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default RegForm;
