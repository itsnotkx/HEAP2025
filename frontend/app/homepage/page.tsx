
import Link from 'next/link';
import Navigationbar from "../../components/navbar";
import EventCard from '@/components/eventCard';
import { getEvents } from '../../lib/server/getEvents';

export default async function App(){
    const events = await getEvents();
    return(
        <>
    <header>
        <Navigationbar/>
    </header>
        <main>
            <div>
      {events.map((event) => (
        
    <Link href={`/events/${event.id}`} key={event.id} passHref>
              {/* Option 1: If EventCard is a <div> or non-anchor */}
              <EventCard event={event} />
              {/* Option 2: If EventCard renders an <a> tag inside, you can omit passHref */}
            </Link>))}
        </div>
                
        </main>
        </>
    )
}