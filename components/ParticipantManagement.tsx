'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Users, Mic, MicOff, UserX, Crown } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

interface ParticipantActionsProps {
  participantId: string;
  isHost: boolean;
  isSelf: boolean;
}

const ParticipantActions = ({ participantId, isHost, isSelf }: ParticipantActionsProps) => {
  const call = useCall();
  const { toast } = useToast();

  if (!call || !isHost || isSelf) return null;

  const handleMuteParticipant = async () => {
    try {
      // Stream SDK may have different API - this is a placeholder
      // await call.muteUser(participantId, true);
      toast({
        title: "Feature coming soon",
        description: "Participant muting will be available in the next update"
      });
    } catch (error) {
      console.error('Mute error:', error);
      toast({
        title: "Failed to mute participant",
        variant: "destructive"
      });
    }
  };

  const handleRemoveParticipant = async () => {
    try {
      // Stream SDK may have different API - this is a placeholder
      // await call.removeMembers([participantId]);
      toast({
        title: "Feature coming soon", 
        description: "Participant removal will be available in the next update"
      });
    } catch (error) {
      console.error('Remove participant error:', error);
      toast({
        title: "Failed to remove participant",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleMuteParticipant}
        className="h-8 w-8 p-0"
        title="Mute participant"
      >
        <MicOff size={14} />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleRemoveParticipant}
        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
        title="Remove participant"
      >
        <UserX size={14} />
      </Button>
    </div>
  );
};

const ParticipantManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const call = useCall();

  const isHost = localParticipant && call?.state.createdBy && 
    localParticipant.userId === call.state.createdBy.id;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] relative"
        title="Manage participants"
      >
        <Users size={20} className="text-white" />
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {participants.length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 w-80 max-h-96 bg-dark-1 border border-gray-600 rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Users size={18} />
          Participants ({participants.length})
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <UserX size={20} />
        </button>
      </div>

      {/* Participants List */}
      <div className="max-h-80 overflow-y-auto p-2">
        {participants.map((participant) => {
          const isSelf = participant.userId === localParticipant?.userId;
          const isParticipantHost = call?.state.createdBy?.id === participant.userId;
          
          return (
            <div
              key={participant.sessionId}
              className="flex items-center justify-between p-3 hover:bg-dark-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  {participant.name?.charAt(0) || participant.userId?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {participant.name || `User ${participant.userId}`}
                    {isSelf && ' (You)'}
                  </p>
                  <div className="flex items-center gap-2">
                    {isParticipantHost && (
                      <Crown size={12} className="text-yellow-500" />
                    )}
                    {participant.isLocalParticipant ? (
                      <Mic size={12} className="text-green-500" />
                    ) : (
                      <MicOff size={12} className="text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              
              <ParticipantActions
                participantId={participant.userId!}
                isHost={!!isHost}
                isSelf={isSelf}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantManagement;
