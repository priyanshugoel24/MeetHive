'use client';

import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';
import React from 'react';

const Home = () => {
    const now = new Date();
    const { upcomingCalls } = useGetCalls();
    
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const date = now.toLocaleDateString('en-US', { month: "short", day: 'numeric', year: 'numeric' });
    
    // Get the next upcoming meeting
    const nextMeeting = upcomingCalls?.[0];
    const nextMeetingTime = nextMeeting?.state?.startsAt 
        ? new Date(nextMeeting.state.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : null;

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
        <div className="w-full h-[300px] rounded-[20px] bg-hero bg-cover">
            <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
                {nextMeetingTime ? (
                    <h2 className='glassmorphism max-w-[300px] rounded py-2 px-4 text-center text-base font-normal'>
                        Upcoming Meeting at: {nextMeetingTime}
                    </h2>
                ) : (
                    <h2 className='glassmorphism max-w-[300px] rounded py-2 px-4 text-center text-base font-normal'>
                        No Upcoming Meetings
                    </h2>
                )}
                <div className="flex flex-col gap-2">
                    <h1 className='text-4xl font-extrabold lg:text-7xl'>{time}</h1>
                    <p className='pl-2 text-lg font-medium text-sky-1 lg:text-2xl'>{day}, {date}</p>
                </div>
            </div>
        </div>

        <MeetingTypeList />
    </section>
  )
}

export default Home
