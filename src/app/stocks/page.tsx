"use client"
import { Stocks } from "@/components/stocks";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React from "react";

const accounts = () => {

  return (
      <>
      <SignedIn>
        <Stocks />
      </SignedIn>
      <SignedOut>
        <p>Sign In first</p>
      </SignedOut>
      </>
  );
};

export default accounts;
