import ProfilePage from "@/components/profile/ProfilePage";

export default function Profile() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <ProfilePage />
        </div>
    </main>
  );
}