

import { eq, desc } from "drizzle-orm";
import db from "../drizzle/db";
import {
  payments,
  bookings,
  TPaymentInsert,
  TPaymentSelect,
  paymentStatusEnum
} from "../drizzle/schema";

// Get all payments
export const getAllPaymentsService = async (): Promise<TPaymentSelect[]> => {
  return await db.query.payments.findMany({
    orderBy: [desc(payments.createdAt)],
    with: {
      booking: true,
    },
  });
};

// Get payment by ID
export const getPaymentByIdService = async (
  paymentId: number
): Promise<TPaymentSelect | undefined> => {
  return await db.query.payments.findFirst({
    where: eq(payments.paymentId, paymentId),
    with: {
      booking:{
        columns: {
          vehicleId: true,
          userId: true,
          bookingId: true,
          bookingDate: true,
          returnDate: true,
          bookingStatus: true,
          totalAmount: true,
          
        }
      },
    },
  });
};

// Get payments by Booking ID
export const getPaymentsByBookingIdService = async (
  bookingId: number
): Promise<TPaymentSelect[]> => {
  return await db.query.payments.findMany({
    where: eq(payments.bookingId, bookingId),
    orderBy: [desc(payments.paymentDate)],
    with: {
      booking: true,
    },
  });
};

// Get payments by status
export const getPaymentsByStatusService = async (
  status: typeof paymentStatusEnum.enumValues[number]
): Promise<TPaymentSelect[]> => {
  return await db.query.payments.findMany({
    where: eq(payments.paymentStatus, status),
    orderBy: [desc(payments.paymentDate)],
    with: {
      booking: true,
    },
  });
};

// Create a new payment
export const createPaymentService = async (
  payment: TPaymentInsert
): Promise<string> => {
  await db.insert(payments).values(payment).returning();
  return "Payment created successfully ✅";
};

// Update an existing payment
export const updatePaymentService = async (
  paymentId: number,
  payment: Partial<TPaymentInsert>
): Promise<string> => {
  await db.update(payments).set(payment).where(eq(payments.paymentId, paymentId));
  return "Payment updated successfully 🔄";
};

// Delete payment by ID
export const deletePaymentService = async (paymentId: number): Promise<string> => {
  await db.delete(payments).where(eq(payments.paymentId, paymentId));
  return "Payment deleted successfully ❌";
};