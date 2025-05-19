import ResetPasswordCode from "@/components/ResetPasswordCode";
import MosqueImage from "@/components/MosqueImage";

export default function ResetPasswordCodePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center bg-white">
          <ResetPasswordCode />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <MosqueImage />
        </div>
      </div>
    </main>
  );
}
