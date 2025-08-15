'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Clock, Users, Lock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface WaitingRoomProps {
  onJoinCall: () => void;
}

const WaitingRoom = ({ onJoinCall }: WaitingRoomProps) => {
  const call = useCall();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  const isHost = localParticipant && call?.state.createdBy && 
    localParticipant.userId === call.state.createdBy.id;

  const meetingTitle = call?.state?.custom?.description || 'Meeting';
  const startTime = call?.state?.startsAt;
  const isScheduledMeeting = startTime && new Date(startTime) > new Date();

  const handleJoinCall = () => {
    try {
      onJoinCall();
      toast({
        title: "Joining meeting",
        description: "Please wait while we connect you..."
      });
    } catch (error) {
      toast({
        title: "Failed to join",
        description: "Unable to join the meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLeaveMeeting = () => {
    router.push('/');
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-dark-2 text-white p-6">
      <div className="max-w-md text-center space-y-6">
        {/* Meeting Info */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-1 rounded-full flex items-center justify-center">
            <Users size={32} className="text-white" />
          </div>
          
          <h1 className="text-2xl font-bold">{meetingTitle}</h1>
          
          {startTime && (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Clock size={16} />
              <span>
                {isScheduledMeeting 
                  ? `Scheduled for ${new Date(startTime).toLocaleString()}`
                  : `Started at ${new Date(startTime).toLocaleString()}`
                }
              </span>
            </div>
          )}

          {/* Participant Count */}
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Users size={16} />
            <span>{participants.length} participant{participants.length !== 1 ? 's' : ''} in meeting</span>
          </div>

          {/* Host Indicator */}
          {isHost && (
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Lock size={16} />
              <span>You are the meeting host</span>
            </div>
          )}
        </div>

        {/* Waiting Room Message */}
        <div className="bg-dark-1 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Ready to join?</h2>
          <p className="text-gray-400 text-sm">
            {isHost 
              ? "As the host, you can start the meeting anytime."
              : isScheduledMeeting
                ? "The meeting will start soon. You'll be able to join when the host arrives."
                : "The meeting is in progress. Click join when you're ready."
            }
          </p>
          
          {user && (
            <div className="text-sm text-gray-400">
              Joining as: <span className="text-white font-medium">{user.fullName || user.username}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {(isHost || !isScheduledMeeting) && (
            <Button 
              onClick={handleJoinCall}
              className="w-full bg-blue-1 hover:bg-blue-600 text-white font-semibold py-3"
            >
              {isHost ? 'Start Meeting' : 'Join Meeting'}
            </Button>
          )}
          
          <Button 
            onClick={handleLeaveMeeting}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Leave
          </Button>
        </div>

        {/* Meeting ID */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          Meeting ID: {call?.id}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
