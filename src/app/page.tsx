"use client"
import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isBrowser = () => typeof window !== "undefined";

  const { isSignedIn } = useUser();

  if(!isSignedIn){
    router.push("/signin");
  }

  return (
    <SignedIn>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className="text-center">Welcome to tally</p>
    </main>
    </SignedIn>
  );
}
