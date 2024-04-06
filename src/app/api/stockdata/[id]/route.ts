import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    {params}: {params: {id: string}}
) {
    try {
        const { userId } = auth();
        const { id } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await prisma.stockData.delete({
            where: {
                id,
            }
        });

        return NextResponse.json({data: data, status: 200, sucess: true})

    } catch (error) {
        console.log("ERROR DELETING TASK: ", error);
        return NextResponse.json({ error: "Error deleting task", status: 500 });
    }
}