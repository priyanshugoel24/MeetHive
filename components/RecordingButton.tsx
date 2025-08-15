'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Video, VideoOff } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const RecordingButton = () => {
  const call = useCall();
  const { toast } = useToast();
  const { useIsCallRecordingInProgress, useIsCallLive } = useCallStateHooks();
  
  const isRecordingInProgress = useIsCallRecordingInProgress();
  const isCallLive = useIsCallLive();

  if (!call || !isCallLive) return null;

  const handleRecording = async () => {
    try {
      if (isRecordingInProgress) {
        await call.stopRecording();
        toast({
          title: "Recording stopped",
          description: "The meeting recording has been stopped"
        });
      } else {
        await call.startRecording();
        toast({
          title: "Recording started",
          description: "The meeting is now being recorded"
        });
      }
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording failed",
        description: "Unable to toggle recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <button
      onClick={handleRecording}
      className={`cursor-pointer rounded-2xl px-4 py-2 transition-colors ${
        isRecordingInProgress 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-[#19232d] hover:bg-[#4c535b]'
      }`}
      title={isRecordingInProgress ? 'Stop recording' : 'Start recording'}
    >
      {isRecordingInProgress ? (
        <VideoOff size={20} className="text-white" />
      ) : (
        <Video size={20} className="text-white" />
      )}
      {isRecordingInProgress && (
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 animate-ping"></span>
      )}
    </button>
  );
};

export default RecordingButton;
