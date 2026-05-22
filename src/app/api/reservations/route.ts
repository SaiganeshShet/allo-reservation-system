import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET ALL RESERVATIONS

export async function GET() {

  try {

    const reservations =
      await prisma.reservation.findMany({
        include: {
          product: true,
          warehouse: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(reservations);

  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to fetch reservations",
      },
      {
        status: 500,
      }
    );
  }
}


// CREATE RESERVATION

export async function POST(
  req: NextRequest
) {

  try {

    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    if (
      !productId ||
      !warehouseId ||
      !quantity
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await prisma.$transaction(
        async (tx) => {

          const inventory =
            await tx.inventory.findFirst({
              where: {
                productId,
                warehouseId,
              },
            });

          if (!inventory) {

            throw new Error(
              "Inventory not found"
            );
          }

          const availableStock =
            inventory.totalStock -
            inventory.reservedStock;

          if (
            availableStock < quantity
          ) {

            throw new Error(
              "Insufficient stock"
            );
          }

          await tx.inventory.update({
            where: {
              id: inventory.id,
            },
            data: {
              reservedStock: {
                increment: quantity,
              },
            },
          });

          const reservation =
            await tx.reservation.create({
              data: {
                productId,
                warehouseId,
                quantity,
                status: "PENDING",
                expiresAt: new Date(
                  Date.now() +
                    15 *
                      60 *
                      1000
                ),
              },
            });

          return reservation;
        }
      );

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json(
      {
        error:
          error.message ||
          "Reservation failed",
      },
      {
        status: 400,
      }
    );
  }
}