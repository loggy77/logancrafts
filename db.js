import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = mysql.createPool({
  connectionLimit: 151,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  timezone: "+00:00",
});

const poolPromise = pool.promise();

export { poolPromise };
