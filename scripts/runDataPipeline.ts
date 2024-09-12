import { runDataPipeline } from '../app/utils/dataPipeline';
import { vectorDb } from '../app/utils/vectorDb';

const profiles = {
  facebook: 'https://www.facebook.com/zach.hastings',
  instagram: 'https://www.instagram.com/zach__hastings/',
  twitter: 'https://x.com/Deepfliquidity',
  debank: 'https://debank.com/profile/0xebd65d1b26f715fc87caf1c12f0cad36ce44fdf5',
  linkedin: 'https://www.linkedin.com/in/zachary-hastings/',
};

runDataPipeline(profiles)
  .then(() => console.log('Pipeline completed successfully'))
  .catch((error) => console.error('Pipeline failed:', error));

async function processData(data: any) {
  // Process and transform your data as needed
  const processedData = {
    name: data.name,
    quote: data.quote,
    personality_traits: data.traits,
    text: `${data.name}: ${data.quote}` // Combine name and quote for text search
  };

  await vectorDb.upsert('your_platform', processedData);
}