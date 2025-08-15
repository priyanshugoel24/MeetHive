'use client';

import { useState } from 'react';
import { UserPlus, Copy, MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';
import { useCall } from '@stream-io/video-react-sdk';
import { useToast } from '@/hooks/use-toast';

const InviteParticipants = () => {
  const [isOpen, setIsOpen] = useState(false);
  const call = useCall();
  const { toast } = useToast();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/meeting/${call?.id}`;
  const meetingId = call?.id;

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: "Meeting link copied",
      description: "Share this link to invite participants"
    });
  };

  const copyMeetingId = () => {
    if (meetingId) {
      navigator.clipboard.writeText(meetingId);
      toast({
        title: "Meeting ID copied",
        description: "Share this ID to invite participants"
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `Join my meeting!\n\nMeeting Link: ${meetingLink}\nMeeting ID: ${meetingId}`
    );
    window.open(`https://wa.me/?text=${message}`);
    toast({
      title: "WhatsApp opened",
      description: "Share the meeting link via WhatsApp"
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
        title="Invite participants"
      >
        <UserPlus size={20} className="text-white" />
      </button>
    );
  }

  return (
    <>
    <div className="fixed right-4 bottom-20 w-96 bg-dark-1 border border-gray-600 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <UserPlus size={18} />
          Invite Participants
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Meeting Info */}
        <div className="bg-dark-3 rounded-lg p-3 space-y-2">
          <div className="text-sm">
            <span className="text-gray-400">Meeting ID:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white font-mono text-sm">{meetingId}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyMeetingId}
                className="h-6 w-6 p-0"
              >
                <Copy size={12} />
              </Button>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Meeting Link:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white text-xs truncate max-w-[250px]">
                {meetingLink}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyMeetingLink}
                className="h-6 w-6 p-0"
              >
                <Copy size={12} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={copyMeetingLink}
              className="flex-1 bg-blue-1 hover:bg-blue-600 text-sm"
            >
              <Copy size={16} className="mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={shareViaWhatsApp}
              variant="outline"
              className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white text-sm"
            >
              <MessageSquare size={16} className="mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-dark-3 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2">How to join:</h4>
          <ol className="text-xs text-gray-400 space-y-1">
            <li>1. Click the meeting link, or</li>
            <li>2. Go to the app and enter the Meeting ID</li>
            <li>3. Join the meeting</li>
          </ol>
        </div>
      </div>
    </div>
    </>
  );
};

export default InviteParticipants;
