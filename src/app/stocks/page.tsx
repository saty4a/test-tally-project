"use client"
import { Stocks } from "@/components/stocks";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React from "react";
import SignInForm from "../signin/page";

const accounts = () => {

  return (
      <>
      <SignedIn>
        <Stocks />
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
      </>
  );
};

export default accounts;
