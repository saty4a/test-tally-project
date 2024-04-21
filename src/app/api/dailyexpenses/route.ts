import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// type Expenses {
//     dailyExpenses: object;
// }

export async function POST(req: NextRequest) {
  try {
    console.log("post request received");

    const expenditure = await req.json();

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const expenses = await prisma.dailyExpenses.create({
      data: {
        ...expenditure,
      },
    });

    return NextResponse.json({ data: expenses, sucess: true, status: 200 });
  } catch (error) {
    console.log("Error creating Daily Expenses: ", error);
    return NextResponse.json({
      error: "Error creating Daily Expenses",
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("get request received");

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const expenses = await prisma.dailyExpenses.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.log("Error getting Daily Expenses: ", error);
    return NextResponse.json({
      error: "Error getting Daily Expenses",
      status: 500,
    });
  }
}
