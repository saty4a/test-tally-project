import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("post request received");

    const openingAmount = await req.json();

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const amount = await prisma.startingAmount.create({
      data: {
        ...openingAmount,
      },
    });

    return NextResponse.json({ data: amount, sucess: true, status: 200 });
  } catch (error) {
    console.log("Error creating Opening Amount: ", error);
    return NextResponse.json({
      error: "Error creating Opening Amount",
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const openingAmount = await prisma.startingAmount.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(openingAmount);
  } catch (error) {
    console.log("ERROR FETCHING Opening Amount: ", error);
    return NextResponse.json({
      error: "Error fetching Opening Amount",
      status: 500,
    });
  }
}
