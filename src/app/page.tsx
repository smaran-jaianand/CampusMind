import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <ChatInterface />
    </div>
  );
}
