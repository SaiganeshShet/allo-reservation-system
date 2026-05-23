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

      const reservation = await tx.reservation.findUnique({
        where: {
          id,
        },
      });

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      if (reservation.status !== "PENDING") {
  throw new Error(
    "Only pending reservations can be confirmed"
  );
}

  

      if (new Date() > reservation.expiresAt) {

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

        await tx.reservation.update({
          where: {
            id,
          },
          data: {
            status: "EXPIRED",
          },
        });

        return NextResponse.json(
          {
            error: "Reservation expired",
          },
          {
            status: 410,
          }
        );
      }

      await tx.inventory.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId,
        },
        data: {
          totalStock: {
            decrement: reservation.quantity,
          },
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
            status: "CONFIRMED",
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
          "Confirmation failed",
      },
      {
        status: 400,
      }
    );
  }
}