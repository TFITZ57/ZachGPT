import pool from './database';
import { PoolClient } from 'pg';
import axios from 'axios';

export const vectorDb = {
  query: async (query: string, limit: number) => {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const queryVector = await convertToVector(query);
      const result = await client.query(
        `SELECT text FROM impersonated_person_data
         ORDER BY vector <-> $1 LIMIT $2`,
        [queryVector, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in vectorDb.query:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  },

  upsert: async (platform: string, data: any) => {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const vector = await convertToVector(data.text);
      await client.query(
        `INSERT INTO impersonated_person_data (name, quote, personality_traits, vector)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO UPDATE
         SET quote = EXCLUDED.quote,
             personality_traits = EXCLUDED.personality_traits,
             vector = EXCLUDED.vector`,
        [data.name, data.quote, data.personality_traits, vector]
      );
    } catch (error) {
      console.error('Error in vectorDb.upsert:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }
};

async function convertToVector(text: string): Promise<number[]> {
  try {
    // Replace with your actual API endpoint and key
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-ada-002'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error in convertToVector:', error);
    throw error;
  }
}