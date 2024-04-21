"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";
import SignInForm from "../signin/page";
import BankBalance from "@/components/bankBalance";

const accounts = () => {
  return (
    <>
      <SignedIn>
        <BankBalance />
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
    </>
  );
};

export default accounts;
