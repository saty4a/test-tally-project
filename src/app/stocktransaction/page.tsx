"use client"
import StockTransaction from "@/components/stocktransaction";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react"
import SignInForm from "../signin/page";

const accounts = () => {
    return(
        <>
        <SignedIn>
        <StockTransaction />
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
        </>
    )
}

export default accounts;