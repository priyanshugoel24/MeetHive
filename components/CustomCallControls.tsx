'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const CustomCallControls = () => {
  const call = useCall();
  const router = useRouter();
  const { toast } = useToast();
  const { 
    useMicrophoneState, 
    useCameraState 
  } = useCallStateHooks();
  
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isMute: isCameraMute } = useCameraState();

  const toggleMicrophone = async () => {
    try {
      if (!isMute) {
        await microphone.disable();
        toast({
          title: "Microphone muted",
          description: "You are now muted"
        });
      } else {
        await microphone.enable();
        toast({
          title: "Microphone unmuted", 
          description: "You are now unmuted"
        });
      }
    } catch (error) {
      console.error('Microphone toggle error:', error);
    }
  };

  const toggleCamera = async () => {
    try {
      if (!isCameraMute) {
        await camera.disable();
        toast({
          title: "Camera turned off",
          description: "Your camera is now off"
        });
      } else {
        await camera.enable();
        toast({
          title: "Camera turned on",
          description: "Your camera is now on"
        });
      }
    } catch (error) {
      console.error('Camera toggle error:', error);
    }
  };  const leaveCall = async () => {
    try {
      await call?.leave();
      router.push('/');
      toast({
        title: "Left meeting",
        description: "You have left the meeting"
      });
    } catch (error) {
      console.error('Leave call error:', error);
    }
  };

  if (!call) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Microphone Toggle */}
      <button
        onClick={toggleMicrophone}
        className={`cursor-pointer rounded-2xl px-4 py-2 transition-colors ${
          !isMute 
            ? 'bg-[#19232d] hover:bg-[#4c535b]' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
        title={!isMute ? 'Mute microphone' : 'Unmute microphone'}
      >
        {!isMute ? (
          <Mic size={20} className="text-white" />
        ) : (
          <MicOff size={20} className="text-white" />
        )}
      </button>

      {/* Camera Toggle */}
      <button
        onClick={toggleCamera}
        className={`cursor-pointer rounded-2xl px-4 py-2 transition-colors ${
          !isCameraMute 
            ? 'bg-[#19232d] hover:bg-[#4c535b]' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
        title={!isCameraMute ? 'Turn off camera' : 'Turn on camera'}
      >
        {!isCameraMute ? (
          <Video size={20} className="text-white" />
        ) : (
          <VideoOff size={20} className="text-white" />
        )}
      </button>

      {/* Leave Call */}
      <button
        onClick={leaveCall}
        className="cursor-pointer rounded-2xl bg-red-500 px-4 py-2 hover:bg-red-600 transition-colors"
        title="Leave meeting"
      >
        <PhoneOff size={20} className="text-white" />
      </button>
    </div>
  );
};

export default CustomCallControls;
