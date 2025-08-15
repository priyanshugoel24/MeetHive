'use client'
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import WaitingRoom from '@/components/WaitingRoom';
import { useGetCallById } from '@/hooks/useGetCallbyId';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'

const Meeting = ({ params : {id} }: { params: { id: string } }) => {

  const {user, isLoaded} = useUser();
  const [meetingState, setMeetingState] = useState<'waiting' | 'setup' | 'joined'>('waiting');
  const {call, isCallLoading} = useGetCallById(id);

  if(!isLoaded || isCallLoading) return <Loader/>
  
  const handleJoinCall = () => {
    setMeetingState('setup');
  };

  const handleSetupComplete = () => {
    setMeetingState('joined');
  };

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {meetingState === 'waiting' && (
            <WaitingRoom onJoinCall={handleJoinCall} />
          )}
          {meetingState === 'setup' && (
            <MeetingSetup setIsSetupComplete={handleSetupComplete} />
          )}
          {meetingState === 'joined' && (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
