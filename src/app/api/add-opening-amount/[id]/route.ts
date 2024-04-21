import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const { id } = params;
    const updateAmount = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await prisma.startingAmount.update({
      where: {
        id,
      },
      data: {
        ...updateAmount,
      },
    });

    return NextResponse.json({ data: data, status: 200, sucess: true });
  } catch (error) {
    console.log("ERROR UPDATING ClosingAmount: ", error);
    return NextResponse.json({
      error: "Error updating closing amount",
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const { id } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await prisma.startingAmount.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ data: data, status: 200, sucess: true });
  } catch (error) {
    console.log("ERROR DELETING Starting Amount: ", error);
    return NextResponse.json({
      error: "Error deleting starting amount",
      status: 500,
    });
  }
}
