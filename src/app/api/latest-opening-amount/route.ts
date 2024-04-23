import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

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
        take: 1,
      });
      return NextResponse.json(openingAmount[0]);
    } catch (error) {
      console.log("ERROR FETCHING Opening Amount: ", error);
      return NextResponse.json({
        error: "Error fetching Opening Amount",
        status: 500,
      });
    }
  }