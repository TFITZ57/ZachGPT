import { scrapeAllProfiles } from './scraper';
import { processData } from './processor';
import { vectorDb } from '../vectorDb';

export async function runDataPipeline(profiles: {[key: string]: string}) {
  // Scrape data
  const scrapedData = await scrapeAllProfiles(profiles);

  // Process data
  const processedData = processData(scrapedData);

  // Store in vector database
  for (const [platform, data] of Object.entries(processedData)) {
    vectorDb.upsert(platform, data);
  }

  console.log('Data pipeline completed successfully');
}