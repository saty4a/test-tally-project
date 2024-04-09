"use client"
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react"
import SignInForm from "../signin/page";
import SalaryExpenses from "@/components/salaryExpenses";

const accounts = () => {
    return(
        <>
        <SignedIn>
        <SalaryExpenses />
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
        </>
    )
}

export default accounts;