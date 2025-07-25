"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const db_1 = __importDefault(require("../drizzle/db"));
async function migration() {
    console.log("Starting migration...");
    await (0, migrator_1.migrate)(db_1.default, {
        migrationsFolder: __dirname + "/migrations"
    });
    console.log("Migration completed successfully.");
    process.exit(0);
}
migration().catch((error) => {
    console.log("error", error);
    process.exit(1);
});
