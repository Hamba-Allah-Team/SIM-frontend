"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Users, AlertCircle, Loader2, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// --- Interface dan Definisi Tipe ---
interface User {
  user_id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  status: string;
  mosque_id?: string;
  created_at: string;
}

interface UpdatedStats {
  activeAdmins: number;
  pendingActivations: number;
  pendingExtensions: number;
}

interface ApiResponse<T> {
  total?: number;
  users?: T[];
}

interface AdminActivityData {
  date: string;
  active: number;
}

type TimeRange = "7d" | "30d" | "12m";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      return storedToken;
    }
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<UpdatedStats | null>(null);
  const [adminActivityData, setAdminActivityData] = useState<
    AdminActivityData[]
  >([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("7d");
  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartDataError, setChartDataError] = useState<string | null>(null);

  const chartConfig = useMemo(
    () => ({
      active: {
        label: "Admin Aktif",
        color: "hsl(25 95% 53%)",
      },
    }),
    []
  );

  // Format date based on selected time range
const formatXAxis = (date: string) => {
  if (selectedTimeRange === "12m") {
    try {
      const months = [
        "Januari", "Februari", "Maret", "April", 
        "Mei", "Juni", "Juli", "Agustus", 
        "September", "Oktober", "November", "Desember"
      ];
      
      if (typeof date === 'number' && date >= 0 && date <= 11) {
        return months[date];
      }
      
      if (typeof date === 'string') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return months[dateObj.getMonth()];
        }
      }
      
      return date;  
    } catch (e) {
      return date; 
    }
  }
  return date; 
};

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setError(
          "Sesi tidak ditemukan atau token tidak valid. Silakan login kembali."
        );
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const urls = {
          activeAdmins: `${API_BASE_URL}/api/users?role=admin&status=active&limit=1`,
          pendingActivations: `${API_BASE_URL}/api/activations?status=pending&limit=1`,
          pendingExtensions: `${API_BASE_URL}/api/extensions?status=pending&limit=1`,
        };

        const [activeAdminsRes, pendingActivationsRes, pendingExtensionsRes] =
          await Promise.all([
            fetch(urls.activeAdmins, { headers }),
            fetch(urls.pendingActivations, { headers }),
            fetch(urls.pendingExtensions, { headers }),
          ]);

        const responses = [
          { name: "activeAdmins", res: activeAdminsRes },
          { name: "pendingActivations", res: pendingActivationsRes },
          { name: "pendingExtensions", res: pendingExtensionsRes },
        ];

        let hasError = false;
        for (const item of responses) {
          if (!item.res.ok) {
            hasError = true;
            const errorBody = await item.res.text();
            console.error(
              `Gagal memuat ${item.name}: ${item.res.status} ${item.res.statusText}`
            );
            if (item.res.status === 401) {
              setError(
                (prevError) =>
                  prevError || `Otentikasi gagal saat memuat ${item.name}.`
              );
            }
          }
        }

        if (hasError) {
          if (!error?.includes("Otentikasi gagal")) {
            setError(
              (prevError) =>
                prevError || "Gagal memuat beberapa data dashboard."
            );
          }
          return;
        }

        const activeAdminsData: ApiResponse<User> =
          await activeAdminsRes.json();
        const pendingActivationsData: ApiResponse<User> =
          await pendingActivationsRes.json();
        const pendingExtensionsData: ApiResponse<User> =
          await pendingExtensionsRes.json();

        setStats({
          activeAdmins: activeAdminsData.total || 0,
          pendingActivations: pendingActivationsData.total || 0,
          pendingExtensions: pendingExtensionsData.total || 0,
        });
      } catch (err: any) {
        console.error("Dashboard fetch error (catch block):", err);
        if (!error) {
          setError(
            err.message ||
              "Terjadi kesalahan tidak diketahui saat memuat data dashboard."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchChartData = async (period: TimeRange) => {
      console.log(`DIAGNOSTIC: fetchChartData - START, period: ${period}`);
      setLoadingChart(true);
      setChartDataError(null);
      setAdminActivityData([]);
      const token = getToken();

      if (!token) {
        console.warn("DIAGNOSTIC: Token tidak ditemukan untuk grafik.");
        setChartDataError("Token otentikasi tidak ditemukan.");
        console.log(
          "DIAGNOSTIC: fetchChartData - END (No Token), loadingChart:",
          false
        );
        return;
      }

      try {
        console.log(
          `DIAGNOSTIC: Mencoba mengambil data grafik dari backend untuk periode: ${period}`
        );
        const response = await fetch(
          `${API_BASE_URL}/api/users/stats/admin-activity-trend?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({
              message: "Gagal memproses respons error dari server.",
            }));
          const errorMessage = `Gagal memuat data aktual (${
            response.status
          }): ${errorData.message || response.statusText}`;
          console.error(
            "DIAGNOSTIC: Gagal memuat data grafik dari backend:",
            errorMessage
          );
          setChartDataError(errorMessage);
        } else {
          const data: AdminActivityData[] = await response.json();
          if (data && data.length > 0) {
            console.log(
              "DIAGNOSTIC: Data grafik berhasil dimuat dari backend:",
              data.length,
              "items"
            );
            setAdminActivityData(data);
          } else {
            console.warn(
              "DIAGNOSTIC: Data grafik dari backend kosong atau format tidak sesuai."
            );
            setChartDataError(
              "Tidak ada data tren yang ditemukan untuk periode ini."
            );
          }
        }
      } catch (chartError: any) {
        console.error(
          "DIAGNOSTIC: Error saat mengambil data grafik dari backend (catch block):",
          chartError
        );
        setChartDataError(
          `Terjadi kesalahan: ${
            chartError.message || "Tidak dapat menghubungi server."
          }`
        );
      } finally {
        setLoadingChart(false);
        console.log(
          "DIAGNOSTIC: fetchChartData - END (Finally), loadingChart:",
          false
        );
      }
    };

    fetchChartData(selectedTimeRange);
  }, [selectedTimeRange]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="ml-4 text-lg text-gray-900">Memuat Dashboard...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">
          Gagal Memuat Dashboard
        </h2>
        <p className="text-red-600 text-center mb-6">{error}</p>
        {error.includes("Otentikasi gagal") ||
        error.includes("Sesi tidak ditemukan") ? (
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            variant="destructive"
            className="mb-2 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Ke Halaman Login
          </Button>
        ) : null}
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-gray-900 border-gray-400 hover:bg-gray-100"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Superadmin Dashboard
        </h1>
        {error && <p className="text-red-600 mt-2">Peringatan Umum: {error}</p>}
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Admin Aktif"
          value={stats?.activeAdmins ?? "..."}
          icon={<Users className="h-10 w-10 text-gray-700" />}
          isLoading={loading}
          linkTo="/superadmin/user"
        />
        <StatCard
          title="Permintaan Aktivasi"
          value={stats?.pendingActivations ?? "..."}
          icon={<Users className="h-10 w-10 text-gray-700" />}
          isLoading={loading}
          linkTo="/superadmin/activation"
        />
        <StatCard
          title="Permintaan Ekstensi"
          value={stats?.pendingExtensions ?? "..."}
          icon={<Users className="h-10 w-10 text-gray-700" />}
          isLoading={loading}
          linkTo="/superadmin/extension"
        />
      </section>

      <section className="mb-8">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <BarChart2 className="mr-2 h-6 w-6 text-gray-700" />
              Statistik Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-end space-x-2">
              {(["7d", "30d", "12m"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTimeRange(range);
                  }}
                  className={`${
                    selectedTimeRange === range
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {range === "7d"
                    ? "7 Hari"
                    : range === "30d"
                    ? "30 Hari"
                    : "12 Bulan"}
                </Button>
              ))}
            </div>
            {/* Logika render untuk Chart / Loader / Error */}
            {loadingChart ? (
              <div className="flex items-center justify-center h-72">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="ml-2 text-gray-600">Memuat data grafik...</p>
              </div>
            ) : chartDataError ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
                <p className="text-red-600 font-medium">
                  Gagal Memuat Data Grafik
                </p>
                <p className="text-sm text-gray-600 mt-1">{chartDataError}</p>
              </div>
            ) : adminActivityData.length > 0 ? (
              <div className="h-72 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={adminActivityData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      accessibilityLayer
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        horizontal={true}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={{
                          stroke: "hsl(var(--foreground))",
                          strokeWidth: 0.5,
                        }}
                        tickMargin={8}
                        fontSize={12}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={formatXAxis}
                        interval={selectedTimeRange === "12m" ? 0 : undefined} 
                      />
                      <YAxis
                        axisLine={{
                          stroke: "hsl(var(--foreground))",
                          strokeWidth: 0.5,
                        }}
                        tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                        tickMargin={8}
                        fontSize={12}
                        stroke="hsl(var(--muted-foreground))"
                        allowDecimals={false}
                        width={40}
                        domain={["dataMin - 1", "dataMax + 1"]} 
                      />
                      <ChartTooltip
                        cursor={true}
                        content={
                          <ChartTooltipContent
                            indicator="line"
                            hideLabel
                            labelClassName="text-sm font-semibold text-gray-900"
                          />
                        }
                      />
                      <Line
                        dataKey="active"
                        type="monotone"
                        stroke={chartConfig.active.color}
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: chartConfig.active.color,
                          strokeWidth: 0,
                        }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name={chartConfig.active.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-72">
                <p className="text-gray-600">
                  Tidak ada data tren untuk ditampilkan pada periode ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// --- Helper Components (StatCard) ---
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
  linkTo: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  isLoading,
  linkTo,
}) => (
  <Link
    href={linkTo}
    className="block hover:shadow-lg transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg"
    aria-label={`Lihat detail untuk ${title}`}
  >
    <Card className="border border-gray-200 p-4 h-full cursor-pointer">
      <div className="flex flex-col items-start space-y-2 h-full justify-between">
        <div>
          <div className="mb-1">{icon}</div>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          )}
          <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
        </div>
      </div>
    </Card>
  </Link>
);
