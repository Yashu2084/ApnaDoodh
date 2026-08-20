"use client";

import dynamic from "next/dynamic";
import { Bot } from "lucide-react";

const ChatWindow = dynamic(() => import("@/components/ChatWindow"), { ssr: false });

export default function AIDairyAssistant() {
  return <ChatWindow trigger={<Bot className="h-6 w-6" />} />;
}
