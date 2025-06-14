import ResetPasswordEmail from "@/components/reset-password/ResetPasswordEmail";
import LoginImage from "@/components/login/MosqueImage";

export default function ResetPassword() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center">
          <ResetPasswordEmail />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoginImage />
        </div>
      </div>
    </main>
  );
}
