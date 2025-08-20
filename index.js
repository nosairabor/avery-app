import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER ,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);


async function seed() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        category TEXT
      );
    `);

    const count = await client.query(`SELECT COUNT(*) FROM transactions`);
    if (parseInt(count.rows[0].count) > 0) {
      console.log("Transactions already seeded");
      return;
    }

    const transactions = [
      { date: "2025-08-01", description: "Salary", amount: 3000, category: "Income" },
      { date: "2025-08-02", description: "Rent", amount: -1200, category: "Housing" },
      { date: "2025-08-03", description: "Groceries", amount: -150, category: "Food" },
      { date: "2025-08-04", description: "Electric Bill", amount: -100, category: "Utilities" },
      { date: "2025-08-05", description: "Freelance Project", amount: 500, category: "Income" },
      { date: "2025-08-06", description: "Coffee", amount: -20, category: "Food" },
      { date: "2025-08-07", description: "Gym", amount: -50, category: "Health" },
      { date: "2025-08-08", description: "Transport", amount: -80, category: "Travel" },
      { date: "2025-08-09", description: "Gift Received", amount: 200, category: "Income" },
      { date: "2025-08-10", description: "Subscription", amount: -15, category: "Entertainment" },
      { date: "2025-08-11", description: "Insurance", amount: -100, category: "Insurance" },
      { date: "2025-08-12", description: "Dinner", amount: -60, category: "Food" },
      { date: "2025-08-13", description: "Sold old laptop", amount: 250, category: "Income" },
      { date: "2025-08-14", description: "Movie", amount: -30, category: "Entertainment" },
      { date: "2025-08-15", description: "Bonus", amount: 400, category: "Income" },
      { date: "2025-08-16", description: "Books", amount: -50, category: "Education" },
      { date: "2025-08-17", description: "Groceries", amount: -180, category: "Food" },
      { date: "2025-08-18", description: "Car Fuel", amount: -60, category: "Transport" },
      { date: "2025-08-19", description: "Freelance Project", amount: 600, category: "Income" },
      { date: "2025-08-20", description: "Rent", amount: -1200, category: "Housing" },
    ];

    for (const ts of transactions) {
      await client.query(
        `INSERT INTO transactions(date, description, amount, category) VALUES ($1, $2, $3, $4)`,
        [ts.date, ts.description, ts.amount, ts.category]
      );
    }

    console.log("Seed completed");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

seed();

// GET endpoint
app.get("/transactions", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM transactions
      WHERE date >= date_trunc('month', CURRENT_DATE)
        AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
      ORDER BY date
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// PORT setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
