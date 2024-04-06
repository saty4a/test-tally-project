import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

interface StockNames{
    P1: string,
    P2: string,
    P3: string,
    P4: string,
    P5: string,
    P6: string,
    P7: string,
}


export async function POST(req: NextRequest){
    try {
        console.log("post request received");

        const stockNames = await req.json();

        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if(!isValidateStocNamesData(stockNames)){
            return new Response(JSON.stringify({ error: "Invalid stocknames data" }), { status: 400 });
        }

        const checkStockName = await prisma.stocksName.findMany();

        if(checkStockName){
            const updatedStockName = await prisma.stocksName.update({
                where: {
                    id: checkStockName[0].id
                },
                data: {
                    ...stockNames,
                }
            })
            return  NextResponse.json({data: updatedStockName, sucess: true, status: 200});
        }


        const names = await prisma.stocksName.create({
            data: {
                P1: stockNames.P1,
                P2: stockNames.P2,
                P3: stockNames.P3,
                P4: stockNames.P4,
                P5: stockNames.P5,
                P6: stockNames.P6,
                P7: stockNames.P7,
            }
        });

        return  NextResponse.json({data: names, sucess: true, status: 200});
    } catch (error) {
        console.log("Error creating stocknames: ", error);
        return NextResponse.json({ error: "Error creating stocknames", status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }
        const stockNames = await prisma.stocksName.findMany();
        return NextResponse.json(stockNames);
    } catch (error) {
        console.log("ERROR FETCHING stocknames: ", error);
        return NextResponse.json({ error: "Error fetching stocknames", status: 500 });
    }
}


function isValidateStocNamesData(data: StockNames){
    return data.P1 && data.P2 && data.P3 && data.P4 && data.P5 && data.P6 && data.P7
}