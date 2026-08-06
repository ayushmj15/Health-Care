import { ChatInterface } from "@/components/chat/chat-interface";
import { getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "AI Health Assistant" };

export default async function AssistantPage() {
  const profile = await getProfile();
  const userId = profile?.id ?? "demo-user";

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Health Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask about symptoms, understand reports, or get specialist suggestions.
        </p>
      </div>
      <ChatInterface userId={userId} />
    </div>
  );
}
