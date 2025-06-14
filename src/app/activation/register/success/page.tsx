import ActivationRegisterSuccess from "@/components/activation/ActivationRegisterSucces";

export default function ActivationRegisterSuccesssPage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center">
          <ActivationRegisterSuccess />
        </div>
      </div>
    </main>
  );
}
