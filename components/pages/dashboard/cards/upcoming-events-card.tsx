import { Card } from '@/components/ui/card'
import Image from 'next/image'

const events = [
    {
        id: 1,
        title: 'Breathwork',
        date: 'Wed, 27 Aug 2:00 PM',
        status: 'Upcoming',
        image: '/event1.jpg',
    },
    {
        id: 2,
        title: 'Orthopaedist',
        date: 'Mon, 1 Sep 3:00 PM',
        status: 'Upcoming',
        image: '/event2.jpg',
    },
]

export function UpcomingEventsCard() {
    return (
        <Card className="bg-white border border-[#F0E6D8] p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-[#545454] mb-4">Next event</h3>

            {/* Events list */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
                {events.map((event) => (
                    <div key={event.id} className="flex gap-3 p-3 rounded-lg hover:bg-[#F7EFE5] transition-colors border border-transparent hover:border-[#F0E6D8]">
                        {/* Event image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F7EFE5]">
                            <Image
                                src={event.image}
                                alt={event.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Event details */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm font-semibold text-[#545454]">{event.title}</p>
                                <span className="px-2 py-1 bg-[#FFF3E0] text-[#E65100] text-xs font-medium rounded">
                                    {event.status}
                                </span>
                            </div>
                            <p className="text-xs text-[#545454] opacity-60">{event.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
