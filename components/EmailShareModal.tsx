'use client';

import { useState } from 'react';
import { Copy, Mail, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface EmailShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingLink: string;
  meetingId: string;
  title?: string;
  customMessage?: string;
}

const EmailShareModal = ({ 
  isOpen, 
  onClose, 
  meetingLink, 
  meetingId, 
  title = "Join my meeting",
  customMessage = "You're invited to join my meeting!"
}: EmailShareModalProps) => {
  const { toast } = useToast();

  const copyEmailTemplate = () => {
    const emailContent = 
      `Subject: ${title}\n\n` +
      `${customMessage}\n\n` +
      `Meeting Link: ${meetingLink}\n` +
      `Meeting ID: ${meetingId}\n\n` +
      `Join now to participate in the discussion.`;
      
    navigator.clipboard.writeText(emailContent);
    toast({
      title: "Email template copied",
      description: "Paste this into your email client"
    });
    onClose();
  };

  const openGmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `${customMessage}\n\n` +
      `Meeting Link: ${meetingLink}\n` +
      `Meeting ID: ${meetingId}\n\n` +
      `Join now to participate in the discussion.`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`);
    toast({
      title: "Gmail opened",
      description: "Compose window opened in Gmail"
    });
  };

  const openOutlook = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `${customMessage}\n\n` +
      `Meeting Link: ${meetingLink}\n` +
      `Meeting ID: ${meetingId}\n\n` +
      `Join now to participate in the discussion.`
    );
    window.open(`https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`);
    toast({
      title: "Outlook opened",
      description: "Compose window opened in Outlook"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-1 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Mail size={18} />
            Email Invitation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Choose how you&apos;d like to send the invitation:
          </p>
          
          {/* Web Email Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={openGmail}
              variant="outline"
              className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              Gmail
            </Button>
            <Button
              onClick={openOutlook}
              variant="outline"
              className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              Outlook
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-1 text-gray-400">Or copy template</span>
            </div>
          </div>
          
          <div className="bg-dark-3 rounded-lg p-3 text-sm max-h-40 overflow-y-auto">
            <div className="text-gray-400 mb-2">Email Template:</div>
            <div className="text-white whitespace-pre-wrap">
              {`Subject: ${title}

${customMessage}

Meeting Link: ${meetingLink}
Meeting ID: ${meetingId}

Join now to participate in the discussion.`}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={copyEmailTemplate}
              className="flex-1 bg-blue-1 hover:bg-blue-600"
            >
              <Copy size={16} className="mr-2" />
              Copy Template
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailShareModal;
