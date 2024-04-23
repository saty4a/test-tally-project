"use client";
import LesureData from "@/components/Lesure/LesureData";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInForm from "./signin/page";

export default function Home() {
  return (
    <>
      <SignedIn>
        <main className="flex flex-col gap-2 my-3">
          <p className="text-center">Welcome to Madan Mohan Bharat Gas</p>
          <LesureData />
        </main>
      </SignedIn>
      <SignedOut>
        <SignInForm />
      </SignedOut>
    </>
  );
}
