import { ProfileForm } from "@/components/profile/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/services/profile.server";
import { initials } from "@/lib/utils";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your personal and medical details — used by doctors and responders.</p>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "User"} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-teal text-2xl text-white">
              {initials(profile.full_name ?? profile.email)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{profile.full_name ?? "Set your name"}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
              {profile.blood_group && <Badge variant="destructive">{profile.blood_group}</Badge>}
              {profile.phone && <Badge variant="outline">{profile.phone}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <ProfileForm user={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
