"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("./schema");
async function seed() {
    console.log('🌱 Starting database seeding...');
    try {
        // Seed Users
        console.log('👥 Seeding users...');
        const userData = [
            {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password1',
                contact: '+254701234567',
                address: '123 Nairobi Street, Nairobi',
                role: 'admin',
            },
            {
                firstname: 'Jane',
                lastname: 'Smith',
                email: 'jane.smith@example.com',
                password: 'password2',
                contact: '+254702345678',
                address: '456 Mombasa Road, Mombasa',
                role: 'user',
            },
            {
                firstname: 'Michael',
                lastname: 'Johnson',
                email: 'michael.johnson@example.com',
                password: 'password3',
                contact: '+254703456789',
                address: '789 Kisumu Avenue, Kisumu',
                role: 'user',
            },
            {
                firstname: 'Sarah',
                lastname: 'Wilson',
                email: 'sarah.wilson@example.com',
                password: 'password4',
                contact: '+254704567890',
                address: '321 Nakuru Lane, Nakuru',
                role: 'user',
            },
            {
                firstname: 'David',
                lastname: 'Brown',
                email: 'david.brown@example.com',
                password: 'password5',
                contact: '+254705678901',
                address: '654 Eldoret Road, Eldoret',
                role: 'disabled',
            },
        ];
        const insertedUsers = await db_1.default.insert(schema_1.users).values(userData).returning();
        console.log(`✅ Inserted ${insertedUsers.length} users`);
        // Seed Vehicle Specifications
        console.log('🚗 Seeding vehicle specifications...');
        const vehicleSpecData = [
            {
                manufacturer: 'Toyota',
                model: 'Corolla',
                year: 2023,
                fuelType: 'Petrol',
                engineCapacity: '1.8L',
                transmission: 'Automatic',
                seatingCapacity: 5,
                color: 'White',
                features: 'Air Conditioning, Bluetooth, USB Ports, Backup Camera',
            },
            {
                manufacturer: 'Honda',
                model: 'Civic',
                year: 2022,
                fuelType: 'Petrol',
                engineCapacity: '2.0L',
                transmission: 'Manual',
                seatingCapacity: 5,
                color: 'Black',
                features: 'Air Conditioning, Bluetooth, Cruise Control',
            },
            {
                manufacturer: 'Tesla',
                model: 'Model 3',
                year: 2024,
                fuelType: 'Electric',
                engineCapacity: 'N/A',
                transmission: 'Automatic',
                seatingCapacity: 5,
                color: 'Blue',
                features: 'Autopilot, Premium Audio, Glass Roof, Supercharging',
            },
            {
                manufacturer: 'Toyota',
                model: 'Prius',
                year: 2023,
                fuelType: 'Hybrid',
                engineCapacity: '1.8L',
                transmission: 'Automatic',
                seatingCapacity: 5,
                color: 'Silver',
                features: 'Hybrid Technology, Eco Mode, Navigation System',
            },
            {
                manufacturer: 'Ford',
                model: 'Explorer',
                year: 2023,
                fuelType: 'Petrol',
                engineCapacity: '3.0L',
                transmission: 'Automatic',
                seatingCapacity: 7,
                color: 'Red',
                features: '4WD, Leather Seats, Panoramic Sunroof, Premium Sound',
            },
            {
                manufacturer: 'Volkswagen',
                model: 'Golf',
                year: 2022,
                fuelType: 'Diesel',
                engineCapacity: '2.0L',
                transmission: 'Manual',
                seatingCapacity: 5,
                color: 'Grey',
                features: 'Turbo Engine, Sport Mode, Digital Dashboard',
            },
            {
                manufacturer: 'BMW',
                model: 'X5',
                year: 2024,
                fuelType: 'Petrol',
                engineCapacity: '3.0L',
                transmission: 'Automatic',
                seatingCapacity: 7,
                color: 'Black',
                features: 'Premium Interior, Navigation, Heated Seats, All-Wheel Drive',
            },
            {
                manufacturer: 'Nissan',
                model: 'Leaf',
                year: 2023,
                fuelType: 'Electric',
                engineCapacity: 'N/A',
                transmission: 'Automatic',
                seatingCapacity: 5,
                color: 'Green',
                features: 'Fast Charging, Eco Mode, Digital Display, Regenerative Braking',
            },
        ];
        const insertedVehicleSpecs = await db_1.default.insert(schema_1.vehicleSpecifications).values(vehicleSpecData).returning();
        console.log(`✅ Inserted ${insertedVehicleSpecs.length} vehicle specifications`);
        // Seed Vehicles
        console.log('🚙 Seeding vehicles...');
        const vehicleData = insertedVehicleSpecs.map((spec, index) => ({
            vehicleSpecId: spec.vehicleSpecId,
            rentalRate: (50 + index * 20).toString(),
            availability: index % 4 !== 0,
        }));
        vehicleData.push({
            vehicleSpecId: insertedVehicleSpecs[0].vehicleSpecId,
            rentalRate: '55.00',
            availability: true,
        }, {
            vehicleSpecId: insertedVehicleSpecs[1].vehicleSpecId,
            rentalRate: '65.00',
            availability: false,
        });
        const insertedVehicles = await db_1.default.insert(schema_1.vehicles).values(vehicleData).returning();
        console.log(`✅ Inserted ${insertedVehicles.length} vehicles`);
        // Seed Locations
        console.log('📍 Seeding locations...');
        const locationData = [
            {
                name: 'Nairobi CBD Branch',
                address: 'Kenyatta Avenue, Nairobi CBD',
                contact: '+254709000001',
            },
            {
                name: 'Mombasa Branch',
                address: 'Moi Avenue, Mombasa',
                contact: '+254709000002',
            },
            {
                name: 'Kisumu Branch',
                address: 'Oginga Odinga Street, Kisumu',
                contact: '+254709000003',
            },
            {
                name: 'Nakuru Branch',
                address: 'Kenyatta Avenue, Nakuru',
                contact: '+254709000004',
            },
            {
                name: 'Eldoret Branch',
                address: 'Uganda Road, Eldoret',
                contact: '+254709000005',
            },
            {
                name: 'JKIA Airport Branch',
                address: 'Jomo Kenyatta International Airport, Nairobi',
                contact: '+254709000006',
            },
        ];
        const insertedLocations = await db_1.default.insert(schema_1.locations).values(locationData).returning();
        console.log(`✅ Inserted ${insertedLocations.length} locations`);
        // Seed Bookings
        console.log('📅 Seeding bookings...');
        const bookingData = [
            {
                userId: insertedUsers[1].userId, // Jane Smith
                vehicleId: insertedVehicles[0].vehicleId,
                locationId: insertedLocations[0].locationId,
                bookingDate: '2024-06-15',
                returnDate: '2024-06-20',
                totalAmount: '275.00',
                bookingStatus: 'Completed',
            },
            {
                userId: insertedUsers[2].userId,
                vehicleId: insertedVehicles[2].vehicleId,
                locationId: insertedLocations[1].locationId,
                bookingDate: '2024-06-25',
                returnDate: '2024-06-28',
                totalAmount: '270.00',
                bookingStatus: 'Confirmed',
            },
            {
                userId: insertedUsers[3].userId,
                vehicleId: insertedVehicles[3].vehicleId,
                locationId: insertedLocations[2].locationId,
                bookingDate: '2024-07-01',
                returnDate: '2024-07-07',
                totalAmount: '660.00',
                bookingStatus: 'Pending',
            },
            {
                userId: insertedUsers[1].userId,
                vehicleId: insertedVehicles[4].vehicleId,
                locationId: insertedLocations[0].locationId,
                bookingDate: '2024-07-10',
                returnDate: '2024-07-12',
                totalAmount: '260.00',
                bookingStatus: 'Cancelled',
            },
            {
                userId: insertedUsers[2].userId,
                vehicleId: insertedVehicles[1].vehicleId,
                locationId: insertedLocations[3].locationId,
                bookingDate: '2024-07-15',
                returnDate: '2024-07-20',
                totalAmount: '350.00',
                bookingStatus: 'Confirmed',
            },
        ];
        const insertedBookings = await db_1.default.insert(schema_1.bookings).values(bookingData).returning();
        console.log(`✅ Inserted ${insertedBookings.length} bookings`);
        // Seed Payments
        console.log('💳 Seeding payments...');
        const paymentData = [
            {
                bookingId: insertedBookings[0].bookingId,
                amount: '275.00',
                paymentStatus: 'Paid',
                paymentMethod: 'Stripe',
                transactionId: 'txn_1234567890',
            },
            {
                bookingId: insertedBookings[1].bookingId,
                amount: '270.00',
                paymentStatus: 'Paid',
                paymentMethod: 'Mpesa',
                transactionId: 'MP240625001',
            },
            {
                bookingId: insertedBookings[2].bookingId,
                amount: '660.00',
                paymentStatus: 'Pending',
                paymentMethod: 'Stripe',
                transactionId: null,
            },
            {
                bookingId: insertedBookings[3].bookingId,
                amount: '260.00',
                paymentStatus: 'Failed',
                paymentMethod: 'Mpesa',
                transactionId: 'MP240710001',
            },
            {
                bookingId: insertedBookings[4].bookingId,
                amount: '350.00',
                paymentStatus: 'Paid',
                paymentMethod: 'Stripe',
                transactionId: 'txn_0987654321',
            },
        ];
        const insertedPayments = await db_1.default.insert(schema_1.payments).values(paymentData).returning();
        console.log(`✅ Inserted ${insertedPayments.length} payments`);
        // Seed Support Tickets
        console.log('🎫 Seeding support tickets...');
        const supportTicketData = [
            {
                userId: insertedUsers[1].userId,
                subject: 'Issue with vehicle pickup',
                description: 'The vehicle was not ready at the scheduled pickup time. Had to wait for 30 minutes.',
                status: 'Resolved',
            },
            {
                userId: insertedUsers[2].userId,
                subject: 'Payment not reflecting',
                description: 'I made the payment via M-Pesa but it is still showing as pending in my account.',
                status: 'Open',
            },
            {
                userId: insertedUsers[3].userId,
                subject: 'Request for booking modification',
                description: 'I need to extend my rental period by 2 more days. How can I do this?',
                status: 'In Progress',
            },
            {
                userId: insertedUsers[1].userId,
                subject: 'Vehicle maintenance issue',
                description: 'The air conditioning in the rented vehicle is not working properly.',
                status: 'Open',
            },
            {
                userId: insertedUsers[2].userId,
                subject: 'Refund request',
                description: 'Due to emergency, I had to cancel my booking. Requesting refund as per policy.',
                status: 'Resolved',
            },
        ];
        const insertedSupportTickets = await db_1.default.insert(schema_1.supportTickets).values(supportTicketData).returning();
        console.log(`✅ Inserted ${insertedSupportTickets.length} support tickets`);
        console.log('🎉 Database seeding completed successfully!');
        console.log(`
    Summary:
    - Users: ${insertedUsers.length}
    - Vehicle Specifications: ${insertedVehicleSpecs.length}
    - Vehicles: ${insertedVehicles.length}
    - Locations: ${insertedLocations.length}
    - Bookings: ${insertedBookings.length}
    - Payments: ${insertedPayments.length}
    - Support Tickets: ${insertedSupportTickets.length}
    `);
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}
// Run the seed function
seed()
    .then(() => {
    console.log('✅ Seeding process completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
exports.default = seed;
