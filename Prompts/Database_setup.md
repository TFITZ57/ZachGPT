
# Database Setup

This guide will walk you through setting up the PostgreSQL database with pgvector for use with the chatbot backend.

## Prerequisites

- PostgreSQL installed locally or hosted on a cloud platform (e.g., Vercel Postgres)
- `pgvector` extension installed on PostgreSQL
- A running instance of your Next.js project

## Step 1: Install Dependencies

Make sure to install the necessary dependencies for PostgreSQL and pgvector.

```bash
npm install pg pgvector
```

## Step 2: Create PostgreSQL Database

Connect to your PostgreSQL instance and create a new database for your project.

```sql
CREATE DATABASE chatbot_db;
```

Then, switch to the new database:

```sql
\c chatbot_db;
```

## Step 3: Enable pgvector Extension

Install and enable the pgvector extension in your database.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 4: Create Tables

Create the necessary tables to store the scraped data and personality vectors.

```sql
CREATE TABLE impersonated_person_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    quote TEXT,
    personality_traits TEXT[],
    vector VECTOR(768) -- Assuming a vector size of 768 from the language model
);
```

### Example Table for Scraped Data:
The table will store quotes, personality traits, and vector embeddings to help the chatbot recall relevant information during conversations.

## Step 5: Database Connection in Next.js

In your project, create a `database.ts` file to handle the connection to your PostgreSQL database.

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set
});

export default pool;
```

## Step 6: Inserting Data

Once you scrape the data, you can insert it into the database. Example query:

```sql
INSERT INTO impersonated_person_data (name, quote, personality_traits, vector)
VALUES ('John Doe', 'Some famous quote', '{laid-back, humorous}', '[0.1, 0.2, 0.3, ...]');
```

## Step 7: Querying Data with pgvector

To query similar data using pgvector, you can run a query like this:

```sql
SELECT * FROM impersonated_person_data
ORDER BY vector <-> '[0.1, 0.2, 0.3, ...]' LIMIT 5;
```

This will return the most similar entries based on vector similarity.

## Step 8: Set Environment Variables

Ensure you have the correct environment variables in your `.env` file for PostgreSQL.

```env
DATABASE_URL=postgres://user:password@hostname:port/chatbot_db
```

Make sure to replace `user`, `password`, `hostname`, `port`, and `chatbot_db` with the actual values.

## Conclusion

You now have a PostgreSQL database set up with pgvector for similarity searches. The next step is integrating this with your backend and deploying it on Vercel.
