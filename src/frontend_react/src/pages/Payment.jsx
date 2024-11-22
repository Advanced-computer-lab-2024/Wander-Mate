import React, { Component } from "react";
import PaymentForm from "../forms/PaymentForm";
import NavigationMenuBar from "../components/NavigationMenuBar";

const PaymentPage = () => {
  return (
    <React.Fragment>
      <NavigationMenuBar />
      <PaymentForm />
    </React.Fragment>
  );
};

export default PaymentPage;
