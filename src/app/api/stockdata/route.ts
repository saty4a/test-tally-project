import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const stockData = await req.json();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const data = await prisma.stockData.create({
      data: {
        date: stockData.date,
        opening_P1: stockData.opening_0,
        opening_P2: stockData.opening_1,
        opening_P3: stockData.opening_2,
        opening_P4: stockData.opening_3,
        opening_P5: stockData.opening_4,
        opening_P6: stockData.opening_5,
        opening_P7: stockData.opening_6,
        closing_P1: stockData.closing_0,
        closing_P2: stockData.closing_1,
        closing_P3: stockData.closing_2,
        closing_P4: stockData.closing_3,
        closing_P5: stockData.closing_4,
        closing_P6: stockData.closing_5,
        closing_P7: stockData.closing_6,
        final_P1: stockData.final_0,
        final_P2: stockData.final_1,
        final_P3: stockData.final_2,
        final_P4: stockData.final_3,
        final_P5: stockData.final_4,
        final_P6: stockData.final_5,
        final_P7: stockData.final_6,
      },
    });

    return NextResponse.json({ data: data, sucess: true, status: 200 });
  } catch (error) {
    console.log("Error creating stocknames: ", error);
    return NextResponse.json({
      error: "Error creating stocknames",
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("stock data get received");

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const data = await prisma.stockData.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: data, sucess: true, status: 200 });
  } catch (error) {
    console.log("Error fetching stockdatas ", error);
    return NextResponse.json({
      error: "Error fetching stockdatas",
      status: 500,
    });
  }
}
