import { vectorDb } from './vectorDb'; // Hypothetical vector database client

export async function getRelevantContext(query: string): Promise<string> {
  try {
    const results = await vectorDb.query(query, 5);
    if (Array.isArray(results)) {
      return results.map((r: any) => r.text || '').join(' ');
    } else if (typeof results === 'object' && results !== null) {
      return Object.values(results).map((r: any) => r.text || '').join(' ');
    } else {
      console.error('Unexpected result type from vectorDb.query:', results);
      return '';
    }
  } catch (error) {
    console.error('Error in getRelevantContext:', error);
    return '';
  }
}