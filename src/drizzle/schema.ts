import {pgTable,serial,varchar,integer,timestamp,numeric,pgEnum,boolean,text,date,} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "admin", "disabled"]);
export const fuelTypeEnum = pgEnum("fuelType", ["Petrol", "Diesel", "Electric", "Hybrid"]);
export const transmissionEnum = pgEnum("transmission", ["Manual", "Automatic"]);
export const bookingStatusEnum = pgEnum("bookingStatus", ["Pending", "Confirmed", "Completed", "Cancelled"]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["Pending", "Paid", "Failed"]);
export const paymentMethodEnum = pgEnum("paymentMethod", ["Stripe", "Mpesa"]);


// Users Table


export const users = pgTable("users", {
  userId: serial("userId").primaryKey(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});


// Vehicle Specifications Table


export const vehicleSpecifications = pgTable("vehicleSpecifications", {
  vehicleSpecId: serial("vehicleSpecId").primaryKey(),
  manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  fuelType: fuelTypeEnum("fuelType").notNull(),
  engineCapacity: varchar("engineCapacity", { length: 50 }),
  transmission: transmissionEnum("transmission").notNull(),
  seatingCapacity: integer("seatingCapacity").notNull(),
  color: varchar("color", { length: 50 }),
  features: text("features"),
});


// Vehicles Table


export const vehicles = pgTable("vehicles", {
  vehicleId: serial("vehicleId").primaryKey(),
  vehicleSpecId: integer("vehicleSpecId")
    .notNull()
    .references(() => vehicleSpecifications.vehicleSpecId, { onDelete: "cascade" }),
  rentalRate: numeric("rentalRate", { precision: 10, scale: 2 }).notNull(),
  availability: boolean("availability").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});


// Locations Table


export const locations = pgTable("locations", {
  locationId: serial("locationId").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});


// Bookings Table


export const bookings = pgTable("bookings", {
  bookingId: serial("bookingId").primaryKey(),
  userId: integer("userId").notNull().references(() => users.userId, { onDelete: "cascade" }),
  vehicleId: integer("vehicleId").notNull().references(() => vehicles.vehicleId, { onDelete: "cascade" }),
  locationId: integer("locationId").notNull().references(() => locations.locationId, { onDelete: "cascade" }),
  bookingDate: date("bookingDate").notNull(),
  returnDate: date("returnDate").notNull(),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  bookingStatus: bookingStatusEnum("bookingStatus").default("Pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});


// Payments Table


export const payments = pgTable("payments", {
  paymentId: serial("paymentId").primaryKey(),
  bookingId: integer("bookingId")
    .notNull()
    .references(() => bookings.bookingId, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus").default("Pending").notNull(),
  paymentDate: timestamp("paymentDate").defaultNow(),
  paymentMethod: paymentMethodEnum("paymentMethod"),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});


// Support Tickets Table


export const supportTickets = pgTable("supporTickets", {
  ticketId: serial("ticketId").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).default("Open"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

//infer types

// USERS
export type TUserInsert = typeof users.$inferInsert;
export type TUserSelect = typeof users.$inferSelect;

// VEHICLE SPECIFICATIONS
export type TVehicleSpecificationInsert = typeof vehicleSpecifications.$inferInsert;
export type TVehicleSpecificationSelect = typeof vehicleSpecifications.$inferSelect;

// VEHICLES
export type TVehicleInsert = typeof vehicles.$inferInsert;
export type TVehicleSelect = typeof vehicles.$inferSelect;

// LOCATIONS
export type TLocationInsert = typeof locations.$inferInsert;
export type TLocationSelect = typeof locations.$inferSelect;

// BOOKINGS
export type TBookingInsert = typeof bookings.$inferInsert;
export type TBookingSelect = typeof bookings.$inferSelect;

// PAYMENTS
export type TPaymentInsert = typeof payments.$inferInsert;
export type TPaymentSelect = typeof payments.$inferSelect;

// SUPPORT TICKETS
export type TSupportTicketInsert = typeof supportTickets.$inferInsert;
export type TSupportTicketSelect = typeof supportTickets.$inferSelect;


// RELATIONS


export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  supportTickets: many(supportTickets),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  bookings: many(bookings),
}));

export const vehicleSpecsRelations = relations(vehicleSpecifications, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  vehicleSpec: one(vehicleSpecifications, {
    fields: [vehicles.vehicleSpecId],
    references: [vehicleSpecifications.vehicleSpecId],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.userId],
  }),
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.vehicleId],
  }),
  location: one(locations, {
    fields: [bookings.locationId],
    references: [locations.locationId],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.bookingId],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.userId],
  }),
}));
