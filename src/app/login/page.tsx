import LoginForm from "@/components/LoginForm";
import MosqueImage from "@/components/MosqueImage";

export default function LoginPage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <LoginForm />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <MosqueImage />
        </div>
      </div>
    </main>
  );
}