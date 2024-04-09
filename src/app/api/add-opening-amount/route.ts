import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        console.log("post request received");

        const openingAmount = await req.json();

        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const checkOpeningAmount = await prisma.startingAmount.findMany();
        console.log(checkOpeningAmount)
        if(checkOpeningAmount?.length > 0){
            const updatedOpeningAmount = await prisma.startingAmount.update({
                where: {
                    id: checkOpeningAmount[0].id
                },
                data: {
                    ...openingAmount,
                }
            })
            return  NextResponse.json({data: updatedOpeningAmount, sucess: true, status: 200});
        }


        const amount = await prisma.startingAmount.create({
            data: {
                ...openingAmount,
            }
        });

        return  NextResponse.json({data: amount, sucess: true, status: 200});
    } catch (error) {
        console.log("Error creating Opening Amount: ", error);
        return NextResponse.json({ error: "Error creating Opening Amount", status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }
        const openingAmount = await prisma.startingAmount.findMany();
        return NextResponse.json(openingAmount[0]);
    } catch (error) {
        console.log("ERROR FETCHING Opening Amount: ", error);
        return NextResponse.json({ error: "Error fetching Opening Amount", status: 500 });
    }
}