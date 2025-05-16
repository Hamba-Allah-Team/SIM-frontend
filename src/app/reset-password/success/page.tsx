import ResetPasswordSucces from "@/components/ResetPasswordSucces";

export default function ResetPasswordSuccessPage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center">
          <ResetPasswordSucces />
        </div>
      </div>
    </main>
  );
}
