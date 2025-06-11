import  ReservationEditForm  from "./formEditReservation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
    params: { id: string };
}

export default function EditReservationPage() {
    return (
        <div className="min-h-screen w-full p-8 bg-white text-black">
            <div className="flex items-center justify-between mb-4 text-black">
                <h1 className="text-[28px] font-bold font-poppins text-black">Ubah Reservasi</h1>
            </div>
            <ReservationEditForm />
        </div>
    );
}