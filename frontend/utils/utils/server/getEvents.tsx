import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';


export async function getEvents() {
  const folder = path.join(process.cwd(), '../backend/utils/webscraper/event_listings'); 
  const files = await fs.readdir(folder);

  // Read and parse all JSON files
  const events = await Promise.all(
    files
      .filter(file => file.endsWith('.json'))
      .map(async file => {
        const content = await fs.readFile(path.join(folder, file), 'utf8');
        return JSON.parse(content);
      })
  );

  return events;
}
