"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubscriptionForm({ onSubmit, onClose, editingSub }) {

  //react hook from setup
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      price: "",
      currency: "INR",
      frequency: "",
      category: "",
      paymentMethod: "",
      status: "active",
      startDate: "",
      renewalDate: "",
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editingSub) {
      reset({
        name: editingSub.name || "",
        price: editingSub.price || "",
        currency: editingSub.currency || "INR",
        frequency: editingSub.frequency || "",
        category: editingSub.category || "",
        paymentMethod: editingSub.paymentMethod || "",
        status: editingSub.status || "active",
        startDate: editingSub.startDate ? editingSub.startDate.slice(0, 10) : "", //yy-mm-dd
        renewalDate: editingSub.renewalDate ? editingSub.renewalDate.slice(0, 10) : "",
      });
    } else {
      reset();
    }
  }, [editingSub, reset]);


  //form submission handler
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success(editingSub ? "Subscription updated ✅" : "Subscription added ✅")
      reset();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting subscription ❌");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">
          {editingSub ? "Edit Subscription" : "Add Subscription"}
        </h2>
        <Button variant="outline" onClick={ onClose}>Close</Button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input 
          className="mt-3"
          {...register("name", { required: "Required", minLength: { value: 2, message: "Min 2 chars" } })} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Price */}
        <div>
          <Label>Price</Label>
          <Input
          className="mt-3"
          type="number" {...register("price", { required: "Required", min: { value: 1, message: "Must be >0" } })} />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        {/* Currency */}
        <div>
          <Label>Currency</Label>
          <Select onValueChange={(v) => setValue("currency", v)} defaultValue="INR">
            <SelectTrigger className="w-full mt-3 ">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Frequency */}
        <div>
          <Label>Frequency</Label>
          <Select onValueChange={(v) => setValue("frequency", v)}>
            <SelectTrigger className="w-full mt-3 ">
                <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select onValueChange={(v) => setValue("category", v)}>
            <SelectTrigger className="w-full mt-3 ">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method */}
        <div>
          <Label>Payment Method</Label>
          <Input 
          className="mt-3"
          {...register("paymentMethod", { required: "Required" })} 
          placeholder="CreditCard/UPI/Net Banking etc..."/>
          {errors.paymentMethod && <p className="text-red-500">{errors.paymentMethod.message}</p>}
        </div>

        {/* Start Date */}
        <div>
          <Label>Start Date</Label>
          <Input  className="mt-3"
          type="date" {...register("startDate", { required: "Required" })} />
          {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
        </div>

        {/* Renewal Date */}
        <div>
          <Label>Renewal Date</Label>
          <Input className="mt-3"
           type="date" {...register("renewalDate")} />
          <p className="text-gray-500 text-sm">(Optional — auto-calculated if empty)</p>
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Select onValueChange={(v) => setValue("status", v)} defaultValue="active">
            <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          {editingSub ? "Update Subscription" : "Add Subscription"}
        </Button>
      </form>
    </div>
  );
}
