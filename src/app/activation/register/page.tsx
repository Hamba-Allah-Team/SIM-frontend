import ActivationSideImage from "@/components/activation/ActivationSideImage";
import ActivationRegisterForm from "@/components/activation/ActivationRegisterForm";

export default function ActivationRegisterPage() {
  return (
    <main className="flex h-full w-full">
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
