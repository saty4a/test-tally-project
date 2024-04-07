import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server"

export async function POST (req: NextRequest){
    try {
        const stockAmount = await req.json();
        
        const { userId } = auth();
    
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized", status: 401 });
        }
    
        const data = await prisma.stockTransactionData.create({
          data: {
            date: stockAmount.date,
            openingAmount: stockAmount.openingAmount,
            cylinders: stockAmount.cylinders,
            loadAmount: stockAmount.loadAmount,
            soldCylinders: stockAmount.soldCylinders,
            soldAmount: stockAmount.soldAmount,
            total: stockAmount.total,
          },
        });
    
        return NextResponse.json({ data: data, sucess: true, status: 200 });
      } catch (error) {
        console.log("Error creating stockAmount: ", error);
        return NextResponse.json({
          error: "Error creating stockAmount",
          status: 500,
        });
      }
}

export async function GET(req: NextRequest) {
    try {
      console.log("stock data get received");;
      
      const { userId } = auth();
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
  
      const data = await prisma.stockTransactionData.findMany({
        orderBy:{
          createdAt: 'desc'
        }
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