/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowBigLeft,
  ContactIcon,
  ArchiveIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from "@/components/ui/full-calendar";
import { id } from "date-fns/locale";
import { useBreakpoint } from "../hook/useBreakpoint";
import CreateDialog from "../create/createDialog";

interface Reservation {
  title: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "approved" | "rejected" | "completed";
}

interface RoomDetail {
  room_id: string;
  place_name: string;
  description: string;
  facilities: string;
  capacity: number;
  image: string;
  reservations?: Reservation[];
}

interface CalendarEvent {
  id: any;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: "yellow" | "green" | "blue" | "pink" | "purple" | "default" | null;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const room_id = params.room_id as string;
  const breakpoint = useBreakpoint();

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Move fetchRoom to component scope so it can be used elsewhere
  const fetchRoom = async () => {
    if (!slug || !room_id || !API) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/guest/rooms/${slug}/${room_id}`);

      if (!res.ok) {
        const errText = await res.text();
        if (errText.includes("Ruangan tidak ditemukan")) {
          throw new Error("not_found");
        } else {
          throw new Error(`Gagal fetch data: ${errText}`);
        }
      }

      const data = await res.json();

      if (!data.data) {
        throw new Error("not_found");
      }

      let imageUrl = data.data.image;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${API}/uploads/${imageUrl}`;
      }

      const roomData = {
        ...data.data,
        image: imageUrl,
      };

      setRoom(roomData);

      if (roomData.reservations) {
        const calendarEvents = roomData.reservations.map(
          (reservation: Reservation, index: number) => {
            const startDateTime = `${reservation.reservation_date}T${reservation.start_time}`;
            const endDateTime = `${reservation.reservation_date}T${reservation.end_time}`;
            // Map status to allowed color values
            const statusColorMap: Record<
              Reservation["status"],
              | "yellow"
              | "green"
              | "blue"
              | "pink"
              | "purple"
              | "default"
              | null
            > = {
              pending: "yellow",
              approved: "green",
              rejected: "pink",
              completed: "blue",
            };
            return {
              id: index,
              title: `${reservation.title} - (${reservation.status})`,
              start: startDateTime,
              end: endDateTime,
              allDay: true,
              color: statusColorMap[reservation.status],
            };
          }
        );
        setEvents(calendarEvents);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [slug, room_id, API]);

  const handleOpenCreateReservation = () => {
    setOpenCreateDialog(true);
  };

  return (
    <>
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto px-6 pt-2">
            <button
              className="flex items-center gap-2 text-base text-black hover:text-orange-500 transition-colors font-medium mb-2"
              onClick={() => router.back()}
            >
              <ArrowBigLeft />
              Kembali
            </button>
            {loading ? (
              <p className="text-gray-500 font-poppins text-3xl text-center">
                Memuat ruangan...
              </p>
            ) : error ? (
              <p className="text-gray-500 font-poppins text-3xl text-center">
                {error}
              </p>
            ) : room ? (
              <>
                <div className="flex flex-col justify-center h-full">
                  {room.image && (
                    <img
                      src={
                        room.image ||
                        "https://placehold.co/400x300/E0E0E0/333333?text=No+Image"
                      }
                      alt={room.place_name}
                      className="min-h-[10vh] md:min-h-[30vh] lg:min-h-[45vh] self-center rounded-2xl mt-4 mb-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/400x300/E0E0E0/333333?text=No+Image";
                      }}
                    />
                  )}
                  <h2 className="text-3xl font-bold text-[#0A1E4A] self-center">
                    {room.place_name}
                  </h2>
                  <div className="flex flex-col md:flex-col lg:flex-row lg:flex-1/2 items-center justify-center mt-4">
                    <div className="flex flex-row bg-white p-4 w-full rounded-2xl border-black border-2 mx-2">
                      <ContactIcon className="text-black self-center h-13 w-13" />
                      <div className="flex flex-col ml-6 self-center">
                        <span className="text-black font-semibold font-poppins m-1">
                          Kapasitas
                        </span>
                        <span className="font-medium text-gray-800 font-poppins m-1">
                          {room.capacity} orang
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row bg-white p-4 w-full rounded-2xl border-black border-2 mx-2 mt-4 md:mt-4 lg:mt-0">
                      <ArchiveIcon className="text-black self-center h-13 w-13" />
                      <div className="flex flex-col ml-6 self-center">
                        <span className="text-black font-semibold font-poppins m-1">
                          Fasilitas
                        </span>
                        <span className="font-medium text-gray-800 font-poppins m-1">
                          {room.facilities || "Tidak ada"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <main className="min-h-[40vh] mx-auto p-6 pt-10 space-y-12">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-poppins text-3xl">
              Memuat isi ruangan...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-poppins text-3xl">{error}</p>
          </div>
        ) : room ? (
          <div className="flex flex-col space-y-8 mx-auto">
            <div className="flex flex-col items-center md:flex-col md:items-center lg:flex-row lg:justify-between lg:items-start max-w-7xl mx-auto rounded-lg p-6 bg-white shadow-md w-full">
              <div className="w-full max-w-2xl flex flex-col lg:ml-6 lg:mt-4">
                <h3 className="text-2xl font-bold text-[#0A1E4A] mb-2 text-center md:text-center lg:text-left justify-center">
                  Deskripsi Ruangan
                </h3>
                <p className="text-gray-700 mb-4 text-center lg:text-left justify-center">
                  {room.description}
                </p>
              </div>
              <div className="bg-white py-6 px-8 my-2 rounded-lg shadow-md w-fit flex flex-col">
                <span className="text-lg font-semibold text-[#0A1E4A] text-center mb-4">
                  Buat Reservasi
                </span>
                <Button
                  className="mt-2"
                  onClick={() => handleOpenCreateReservation()}
                >
                  Buat Reservasi
                </Button>
              </div>
            </div>
            {breakpoint !== "sm" && (
              <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 w-full">
                <h3 className="text-2xl font-bold text-[#0A1E4A] mb-2 text-center my-2">
                  Jadwal Reservasi
                </h3>
                <Calendar
                  locale={id}
                  events={events.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    color: event.color,
                  }))}
                >
                  <div className="h-dvh py-6 flex flex-col">
                    <div className="flex px-6 items-center gap-2 mb-6 text-black">
                      <CalendarViewTrigger
                        view="week"
                        className="aria-[current=true]:bg-orange-500 aria-[current=true]:text-white rounded-lg px-3 py-1 hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        Week
                      </CalendarViewTrigger>
                      <CalendarViewTrigger
                        view="month"
                        className="aria-[current=true]:bg-orange-500 aria-[current=true]:text-white rounded-lg px-3 py-1 hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        Month
                      </CalendarViewTrigger>

                      <span className="flex-1" />

                      <CalendarCurrentDate />

                      <span className="flex-1" />

                      <CalendarPrevTrigger>
                        <ChevronLeft size={20} />
                        <span className="sr-only">Previous</span>
                      </CalendarPrevTrigger>

                      <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                      <CalendarNextTrigger>
                        <ChevronRight size={20} />
                        <span className="sr-only">Next</span>
                      </CalendarNextTrigger>
                    </div>

                    <div className="flex-1 overflow-auto px-6 relative">
                      <CalendarWeekView />
                      <CalendarMonthView />
                    </div>
                  </div>
                </Calendar>
              </div>
            )}
            <CreateDialog
              open={openCreateDialog}
              onOpenChange={setOpenCreateDialog}
              slug={slug}
              room_id={Number(room.room_id)}
              onReservationSuccess={fetchRoom}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Ruangan tidak ditemukan.
          </div>
        )}
      </main>
    </>
  );
}
