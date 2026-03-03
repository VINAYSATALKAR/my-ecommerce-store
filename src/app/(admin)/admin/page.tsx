import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import StatusDropdown from "./StatusDropdown"; // Make sure your StatusDropdown is here!

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside text-muted-foreground text-xs">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.product.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(Number(order.amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}