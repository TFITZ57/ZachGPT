// Implement or import your actual vector database client
export const vectorDb = {
  query: (query: string, limit: number) => Promise<{ text: string; }[]>,
  upsert: (platform: string, data: any) => Promise<void>
};