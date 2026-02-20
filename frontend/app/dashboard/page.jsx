"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import SubscriptionForm from "@/components/SubscriptionForm";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // ShadCN Dialog components

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`;

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingSub, setEditingSub] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSubscriptions = async () => {
    if (!token) return toast.error("You are not logged in!");
    setLoading(true);
    setError(null);

    try {

      // Get user ID from token payload (assuming JWT has userId)
       const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.user_id || payload.userId; // check correct key
    if (!userId) throw new Error("Invalid token: missing userId");

      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch subscriptions");
      }

      const data = await res.json();
      setSubscriptions(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching subscriptions ❌");
      toast.error(err.message || "Error fetching subscriptions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleFormSubmit = async (formData) => {
    if (!token) return toast.error("You are not logged in!");
    setLoading(true);

    try {
      const url = editingSub ? `${BASE_URL}/${editingSub._id}` : BASE_URL;
      const method = editingSub ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit subscription");
      }

      toast.success(editingSub ? "Updated successfully ✅" : "Added successfully ✅");
      setEditingSub(null);
      setShowForm(false);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error submitting subscription ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return toast.error("You are not logged in!");
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete subscription");
      }

      toast.success("Deleted successfully ✅");
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting subscription ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!token) return toast.error("You are not logged in!");
    if (!confirm("Are you sure you want to cancel this subscription?")) return;

    setLoading(true);

    try {
      console.log("Cancelling subscription with ID:", id);
      console.log("Using token:", token);

      const res = await fetch(`${BASE_URL}/${id}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        const errorMessage = data.error || data.message || "Failed to cancel subscription";
        throw new Error(errorMessage);
      }

      console.log("Subscription cancelled successfully:", data);
      toast.success("Cancelled successfully ✅");
      fetchSubscriptions();
    } catch (err) {
      console.error("Error in handleCancel:", err);
      toast.error(err.message || "Error cancelling subscription ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
         
        </div>

        {loading && <p>Loading subscriptions...</p>}
        {error && (
          <div className="mb-4 text-red-600">
            <p>{error}</p>
            <Button onClick={fetchSubscriptions} disabled={loading}>
              Retry
            </Button>
          </div>
        )}
        {!loading && subscriptions.length === 0 && !error && (
          <p>No subscriptions found. Add one to get started!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-bold text-lg">{sub.name}</h2>
              <p>Price: {sub.price} {sub.currency}</p>
              <p>Frequency: {sub.frequency}</p>
              <p>Category: {sub.category}</p>
              <p>Status: {sub.status}</p>
              <p>Payment Method: {sub.paymentMethod}</p>
              <p>Start Date: {new Date(sub.startDate).toLocaleDateString()}</p>
              <p>Renewal Date: {new Date(sub.renewalDate).toLocaleDateString()}</p>

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingSub(sub);
                    setShowForm(true);
                  }}
                  disabled={loading}
                >
                  Edit
                </Button>
                {sub.status !== "canceled" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(sub._id)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(sub._id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

            {/* Modal for Add/Edit */}
<Dialog open={showForm} onOpenChange={setShowForm}>
  <DialogContent className="max-w-lg w-full h-[80vh] overflow-y-auto p-6">
    <DialogHeader>
      <DialogTitle>{editingSub ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
      <DialogDescription>
        {editingSub
          ? "Update your subscription details below."
          : "Fill in the details to add a new subscription."}
      </DialogDescription>
    </DialogHeader>

    <SubscriptionForm
      onSubmit={handleFormSubmit}
      editingSub={editingSub}
      onClose={() => setShowForm(false)}
    />
  </DialogContent>
</Dialog>

      </div>
    </div>
  );
}
