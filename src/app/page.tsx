"use client";

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function Home() {

  const products = await fetchData("/api/products");

  const warehouses = await fetchData("/api/warehouses");

  const inventory = await fetchData("/api/inventory");

  const reservations = await fetchData("/api/reservations");

  const totalProducts = products.length;

  const totalWarehouses = warehouses.length;

  const totalInventory = inventory.reduce(
    (acc: number, item: any) =>
      acc + item.totalStock,
    0
  );

  const activeReservations =
    reservations.filter(
      (r: any) =>
        r.status === "PENDING" ||
        r.status === "CONFIRMED"
    ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2 text-gray-800">
          Allo Reservation System
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          Inventory & Reservation Dashboard
        </p>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm">
              Products
            </h2>

            <p className="text-4xl font-bold mt-2 text-blue-600">
              {totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm">
              Warehouses
            </h2>

            <p className="text-4xl font-bold mt-2 text-green-600">
              {totalWarehouses}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm">
              Total Stock
            </h2>

            <p className="text-4xl font-bold mt-2 text-purple-600">
              {totalInventory}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm">
              Active Reservations
            </h2>

            <p className="text-4xl font-bold mt-2 text-red-600">
              {activeReservations}
            </p>
          </div>

        </div>

        {/* PRODUCTS */}

        <section className="mb-12">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {products.map((product: any) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-green-600 font-semibold mt-3 text-lg">
                  ₹ {product.price}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WAREHOUSES */}

        <section className="mb-12">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Warehouses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {warehouses.map((warehouse: any) => (

              <div
                key={warehouse.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {warehouse.name}
                </h3>

                <p className="text-gray-600 mt-3 text-lg">
                  {warehouse.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INVENTORY */}

        <section className="mb-12">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {inventory.map((item: any) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {item.product.name}
                </h3>

                <div className="space-y-3 text-gray-700 text-lg">

                  <p>
                    <span className="font-semibold">
                      Warehouse:
                    </span>{" "}
                    {item.warehouse.name}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Total Stock:
                    </span>{" "}
                    {item.totalStock}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Reserved:
                    </span>{" "}
                    {item.reservedStock}
                  </p>

                  <p>
                    <span className="font-semibold text-green-600">
                      Available:
                    </span>{" "}
                    {item.totalStock - item.reservedStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESERVATIONS */}

        <section>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Reservations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {reservations.map((reservation: any) => (

              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-center mb-4">

                  <div>

                    <h3 className="text-2xl font-bold text-gray-800">
                      {reservation.product.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {reservation.warehouse.name}
                    </p>

                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                    ${
                      reservation.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : reservation.status === "RELEASED"
                        ? "bg-red-100 text-red-700"
                        : reservation.status === "EXPIRED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {reservation.status}
                  </span>

                </div>

                <div className="space-y-3 text-gray-700">

                  <p>
                    <span className="font-semibold">
                      Quantity:
                    </span>{" "}
                    {reservation.quantity}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Expires:
                    </span>{" "}
                    {new Date(
                      reservation.expiresAt
                    ).toLocaleString()}
                  </p>

                </div>

                {reservation.status === "PENDING" && (

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={async () => {

                        await fetch(
                          `/api/reservations/${reservation.id}/confirm`,
                          {
                            method: "PATCH",
                          }
                        );

                        location.reload();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={async () => {

                        await fetch(
                          `/api/reservations/${reservation.id}/release`,
                          {
                            method: "PATCH",
                          }
                        );

                        location.reload();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      Release
                    </button>

                  </div>

                )}

              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}