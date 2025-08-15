'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Monitor, MonitorStop } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const ScreenShareButton = () => {
  const call = useCall();
  const { toast } = useToast();
  const { useHasOngoingScreenShare, useIsCallLive } = useCallStateHooks();
  
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const isCallLive = useIsCallLive();

  if (!call || !isCallLive) return null;

  const handleScreenShare = async () => {
    try {
      if (hasOngoingScreenShare) {
        await call.screenShare.disable();
        toast({
          title: "Screen sharing stopped",
          description: "You've stopped sharing your screen"
        });
      } else {
        await call.screenShare.enable();
        toast({
          title: "Screen sharing started",
          description: "You're now sharing your screen"
        });
      }
    } catch (error) {
      console.error('Screen share error:', error);
      toast({
        title: "Screen sharing failed",
        description: "Unable to start screen sharing. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <button
      onClick={handleScreenShare}
      className={`cursor-pointer rounded-2xl px-4 py-2 transition-colors ${
        hasOngoingScreenShare 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-[#19232d] hover:bg-[#4c535b]'
      }`}
      title={hasOngoingScreenShare ? 'Stop screen sharing' : 'Start screen sharing'}
    >
      {hasOngoingScreenShare ? (
        <MonitorStop size={20} className="text-white" />
      ) : (
        <Monitor size={20} className="text-white" />
      )}
    </button>
  );
};

export default ScreenShareButton;
