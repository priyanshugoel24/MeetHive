"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useGetCallById } from "@/hooks/useGetCallbyId";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, MessageSquare, Share2, X } from "lucide-react";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);
    


    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/meeting/${meetingId}?personal=true`;

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join my Personal Meeting Room');
    const body = encodeURIComponent(
      `You're invited to join my personal meeting room!\n\n` +
      `Meeting Link: ${meetingLink}\n` +
      `Meeting ID: ${meetingId}\n\n` +
      `This is my permanent meeting room - you can join anytime!`
    );
    
    try {
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
      const newWindow = window.open(mailtoLink);
      
      if (!newWindow || newWindow.closed) {
        setIsEmailModalOpen(true);
      } else {
        toast({
          title: "Email client opened",
          description: "Invitation email prepared"
        });
      }
    } catch (error) {
      setIsEmailModalOpen(true);
    }
  };

  const copyEmailTemplate = () => {
    const emailContent = 
      `Subject: Join my Personal Meeting Room\n\n` +
      `You're invited to join my personal meeting room!\n\n` +
      `Meeting Link: ${meetingLink}\n` +
      `Meeting ID: ${meetingId}\n\n` +
      `This is my permanent meeting room - you can join anytime!`;
      
    navigator.clipboard.writeText(emailContent);
    toast({
      title: "Email template copied",
      description: "Paste this into your email client"
    });
    setIsEmailModalOpen(false);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `Join my personal meeting room!\n\nMeeting Link: ${meetingLink}\nMeeting ID: ${meetingId}`
    );
    window.open(`https://wa.me/?text=${message}`);
    toast({
      title: "WhatsApp opened",
      description: "Share your meeting room via WhatsApp"
    });
  };

  return (
    <>
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5 flex-wrap">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          <Copy size={16} className="mr-2" />
          Copy Invitation
        </Button>
        <Button
          variant="outline"
          className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
          onClick={shareViaWhatsApp}
        >
          <MessageSquare size={16} className="mr-2" />
          Share via WhatsApp
        </Button>
        <Button
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
          onClick={shareViaEmail}
        >
          <Mail size={16} className="mr-2" />
          Share via Email
        </Button>
      </div>
    </section>

    {/* Email Template Modal */}
    {isEmailModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark-1 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Email Invitation</h3>
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Your browser blocked the email client. You can copy this template and paste it into your email:
            </p>
            
            <div className="bg-dark-3 rounded-lg p-3 text-sm">
              <div className="text-gray-400 mb-2">Email Template:</div>
              <div className="text-white whitespace-pre-wrap">
                {`Subject: Join my Personal Meeting Room

You're invited to join my personal meeting room!

Meeting Link: ${meetingLink}
Meeting ID: ${meetingId}

This is my permanent meeting room - you can join anytime!`}
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
                onClick={() => setIsEmailModalOpen(false)}
                variant="outline"
                className="flex-1 border-gray-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PersonalRoom;