import LoginForm from "@/components/LoginForm"
import LoginImage from "@/components/LoginImage"

export default function LoginPage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center p-12">
          <LoginForm />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoginImage />
        </div>
      </div>
    </main>
  );
}