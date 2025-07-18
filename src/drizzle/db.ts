import { Client } from "pg";

import{drizzle} from "drizzle-orm/node-postgres"

import * as schema from "./schema"
import "dotenv/config";

export const client=new Client({
connectionString:process.env.DATABASE_URL as string

})
const main = async() =>{
    await client.connect();
}
main().catch(console.error)


const db = drizzle(client, {schema, logger:true})

export default db;
