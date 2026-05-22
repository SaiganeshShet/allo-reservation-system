import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {

    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",
          expiresAt: {
            lte: new Date(),
          },
        },
      });

    for (const reservation of expiredReservations) {

      await prisma.$transaction(async (tx) => {

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId: reservation.productId,
              warehouseId: reservation.warehouseId,
            },
          });

        if (inventory) {
          await tx.inventory.update({
            where: {
              id: inventory.id,
            },
            data: {
              reservedStock: {
                decrement: reservation.quantity,
              },
            },
          });
        }

        await tx.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: "EXPIRED",
          },
        });

      });

    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredReservations.length,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}