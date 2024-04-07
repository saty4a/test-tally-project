import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      console.log("stock data get received");;
      
      const { userId } = auth();
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
  
      const data = await prisma.stockData.findMany({
        orderBy:{
          createdAt: 'desc'
        },
        take: 1
      });

      return NextResponse.json({ data: data[0], sucess: true, status: 200 });
    } catch (error) {
      console.log("Error fetching stockdatas ", error);
      return NextResponse.json({
        error: "Error fetching stockdatas",
        status: 500,
      });
    }
}