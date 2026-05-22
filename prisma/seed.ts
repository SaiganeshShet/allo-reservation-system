import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Warehouses
  const bangaloreWarehouse = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  const mumbaiWarehouse = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
      location: "Mumbai",
    },
  });

  // Create Products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
      price: 79999,
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: "MacBook Air M3",
      price: 129999,
    },
  });

  // Create Inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 10,
      },
      {
        productId: iphone.id,
        warehouseId: mumbaiWarehouse.id,
        totalStock: 5,
      },
      {
        productId: macbook.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 7,
      },
      {
        productId: macbook.id,
        warehouseId: mumbaiWarehouse.id,
        totalStock: 3,
      },
    ],
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });