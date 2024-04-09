"use client"
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react"
import SignInForm from "../signin/page";
import DailyExpenses from "@/components/dailyExpenses";

const accounts = () => {
    return(
        <>
        <SignedIn>
        <DailyExpenses />
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
        </>
    )
}

export default accounts;