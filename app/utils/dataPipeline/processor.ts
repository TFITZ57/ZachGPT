import { removeStopwords } from 'stopword';

function cleanText(text: string): string {
  // Remove HTML tags, special characters, etc.
  return text.replace(/<[^>]*>?/gm, '').replace(/[^a-zA-Z0-9 ]/g, '');
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/);
}

export function processData(scrapedData: Record<string, any>) {
  const processedData: Record<string, string> = {};
  for (const [platform, data] of Object.entries(scrapedData)) {
    const cleanedText = cleanText(JSON.stringify(data));
    const tokens = tokenize(cleanedText);
    const filteredTokens = removeStopwords(tokens);
    processedData[platform] = filteredTokens.join(' ');
  }
  return processedData;
}