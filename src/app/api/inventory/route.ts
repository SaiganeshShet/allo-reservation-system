import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });

    return NextResponse.json(inventory);

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}