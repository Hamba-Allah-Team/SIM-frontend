import LoginForm from "@/components/LoginForm"
import LoginImage from "@/components/LoginImage"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#FF9357" }}>
      <div className="flex-3 flex flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center p-12">
          <LoginForm />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoginImage />
        </div>
      </div>
    </main>
  )
}