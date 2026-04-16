import { defineConfig } from "drizzle-kit";
<<<<<<< HEAD
import * as dotenv from "dotenv";

// Load the .env file from the /server folder
dotenv.config({ path: "./server/.env" }); 
=======
>>>>>>> d0a6ff7366ca6b6442c6ae10f05246e32109fee5

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
<<<<<<< HEAD
  dialect: "postgresql",
=======
  dialect: "mysql",
>>>>>>> d0a6ff7366ca6b6442c6ae10f05246e32109fee5
  dbCredentials: {
    url: connectionString,
  },
});
