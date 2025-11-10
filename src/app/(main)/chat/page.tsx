
import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
  return (
    <main className="flex h-[calc(100svh-3.5rem)] flex-col items-center justify-center p-4 md:h-svh">
        <ChatInterface />
    </main>
  );
}
