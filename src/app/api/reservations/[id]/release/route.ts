import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const result = await prisma.$transaction(async (tx) => {

      const reservation =
        await tx.reservation.findUnique({
          where: {
            id,
          },
        });

      if (!reservation) {
        throw new Error(
          "Reservation not found"
        );
      }

      if (
        reservation.status === "RELEASED"
      ) {
        throw new Error(
          "Reservation already released"
        );
      }

      await tx.inventory.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId,
        },
        data: {
          reservedStock: {
            decrement: reservation.quantity,
          },
        },
      });

      const updatedReservation =
        await tx.reservation.update({
          where: {
            id,
          },
          data: {
            status: "RELEASED",
          },
        });

      return updatedReservation;
    });

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json(
      {
        error:
          error.message ||
          "Release failed",
      },
      {
        status: 400,
      }
    );
  }
}