"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    setStatus(newStatus);
    
    try {
      // Send the new status to our backend API
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Refresh the page in the background to sync the latest data
      router.refresh(); 
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <select 
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isLoading}
      className={`border text-xs font-semibold rounded-full px-2.5 py-1 transition-colors cursor-pointer ${isLoading ? "opacity-50" : ""}
        ${status === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : ''}
        ${status === 'SHIPPED' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
        ${status === 'DELIVERED' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
        ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
        ${status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' : ''}
      `}
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}