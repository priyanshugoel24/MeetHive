import { cn } from "@/lib/utils";
import { CallControls, CallingState, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LayoutList, Loader } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import ScreenShareButton from "./ScreenShareButton";
import MeetingChat from "./MeetingChat";
import RecordingButton from "./RecordingButton";
import ParticipantManagement from "./ParticipantManagement";
  

type CallLayouttype = "speaker-left" | "speaker-right" | "grid";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setlayout] = useState<CallLayouttype>("speaker-left");
  const router = useRouter();

  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState != CallingState.JOINED) return <Loader/>;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;

      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" />;

      default:
        return <SpeakerLayout participantsBarPosition="left" />;
    }
  };
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
            <CallLayout />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full justify-center items-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push('/')}/>

        <DropdownMenu>
            <div className="flex items-center">
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                    <LayoutList size={20} className="text-white " />
                    
                </DropdownMenuTrigger>
            </div>
            
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                {["Speaker-Left", "Speaker-Right", "Grid"].map((item, index) => (
                    <div key={index}>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>{ setlayout(item.toLowerCase() as CallLayouttype)}}
                            >{item}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-dark-1" />
                    </div>
                ))}
                
                
            </DropdownMenuContent>
        </DropdownMenu>

        <ScreenShareButton />
        <RecordingButton />
        <CallStatsButton />
        <ParticipantManagement />
        {!isPersonalRoom && <EndCallButton />}

      </div>
      
      <MeetingChat />
    </section>
  );
};

export default MeetingRoom;
