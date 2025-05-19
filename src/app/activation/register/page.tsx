import ActivationSideImage from "@/components/ActivationSideImage";
import ActivationRegisterForm from "@/components/ActivationRegisterForm";

export default function ActivationRegisterPage() {
  return (
    <main className="flex h-screen w-screen">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center">
          <ActivationSideImage />
        </div>
        <div className="flex-1 flex items-center justify-center bg-custom-orange">
          <ActivationRegisterForm />
        </div>
      </div>
    </main>
  );
}
