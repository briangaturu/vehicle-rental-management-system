import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db from '../drizzle/db';

async function migration() {
    console.log("Starting migration...");
    await migrate(db, {
        migrationsFolder:__dirname + "/migrations" 
    });

    console.log("Migration completed successfully.");
    process.exit(0);
}

migration().catch((error) => {
    console.log("error", error);
    process.exit(1);
});