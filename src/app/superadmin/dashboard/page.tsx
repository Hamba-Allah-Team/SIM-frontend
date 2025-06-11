"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  AlertCircle,
  Loader2,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- Interfaces ---
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

interface TopCardStats {
  activeAdmins: number;
  pendingActivations: number;
  pendingExtensions: number;
}

interface ApiCountResponse<T> {
  total?: number;
  users?: T[];
  activations?: T[];
  extensions?: T[];
}

interface ChartDataPoint {
  date: string;
  activations?: number;
  extensions?: number;
}

interface ChartApiResponse {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

type TimeRange = "7d" | "30d" | "12m";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Helper Functions ---
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

// --- Main Component ---
export default function DashboardPage() {
  const [stats, setStats] = useState<TopCardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("7d");
  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartDataError, setChartDataError] = useState<string | null>(null);

  const timeRangeOptions = [
    { value: "7d" as TimeRange, label: "7 Hari" },
    { value: "30d" as TimeRange, label: "30 Hari" },
    { value: "12m" as TimeRange, label: "1 Tahun" },
  ];

  // --- Chart Configuration ---
  const chartConfig = useMemo(
    () => ({
      activations: {
        label: "Aktivasi Baru",
        color: "hsl(142.1 76.2% 36.3%)", // Green
      },
      extensions: {
        label: "Perpanjangan",
        color: "hsl(221.2 83.2% 53.3%)", // Blue
      },
    }),
    []
  );

  // --- Date Formatting for Chart Axis ---
const formatXAxis = (date: string) => {
  try {
    if (!date) return "";
    const timeZone = "Asia/Jakarta";

    if (selectedTimeRange === "12m") {
      const [year, month] = date.split('-').map(Number);
      const dateObj = new Date(Date.UTC(year, month - 1));
      if (isNaN(dateObj.getTime())) return date;
      return dateObj.toLocaleDateString("id-ID", { month: "short", timeZone });
    } else {
      const dateObj = new Date(date + 'T00:00:00Z');
      if (isNaN(dateObj.getTime())) return date;
      return dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return date;
  }
};
  
  // --- Data Fetching for Top Stat Cards ---
  useEffect(() => {
    const fetchTopCardData = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setError("Sesi tidak ditemukan. Silakan login kembali.");
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
          await Promise.all(
            Object.values(urls).map((url) => fetch(url, { headers }))
          );

        const responses = [
          { name: "Admin Aktif", res: activeAdminsRes },
          { name: "Aktivasi Pending", res: pendingActivationsRes },
          { name: "Ekstensi Pending", res: pendingExtensionsRes },
        ];

        for (const item of responses) {
          if (!item.res.ok) {
            if (item.res.status === 401) {
              setError("Otentikasi gagal. Silakan login kembali.");
              return;
            }
            throw new Error(`Gagal memuat data: ${item.name}`);
          }
        }

        const activeAdminsData: ApiCountResponse<User> = await activeAdminsRes.json();
        const pendingActivationsData: ApiCountResponse<any> = await pendingActivationsRes.json();
        const pendingExtensionsData: ApiCountResponse<any> = await pendingExtensionsRes.json();

        setStats({
          activeAdmins: activeAdminsData.total || 0,
          pendingActivations: pendingActivationsData.total || 0,
          pendingExtensions: pendingExtensionsData.total || 0,
        });

      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan tidak diketahui.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCardData();
  }, []);

  // --- Data Fetching for Chart (Updated Logic) ---
  useEffect(() => {
    const fetchChartData = async (period: TimeRange) => {
      setLoadingChart(true);
      setChartDataError(null);
      setChartData([]);
      const token = getToken();

      if (!token) {
        setChartDataError("Token otentikasi tidak ditemukan.");
        setLoadingChart(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const url = `${API_BASE_URL}/api/dashboard/stats?period=${period}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal memuat data grafik.");
        }

        const data: ChartApiResponse = await response.json();

        const activationDataset = data.datasets.find(d => d.label === "Aktivasi Baru");
        const extensionDataset = data.datasets.find(d => d.label === "Perpanjangan");
        
        if (!data.labels || !activationDataset || !extensionDataset) {
             throw new Error("Format data dari server tidak sesuai.");
        }

        const transformedData = data.labels.map((label, index) => ({
            date: label,
            activations: activationDataset.data[index] || 0,
            extensions: extensionDataset.data[index] || 0,
        }));
        
        setChartData(transformedData);

      } catch (chartError: any) {
        setChartDataError(chartError.message || "Tidak dapat menghubungi server.");
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData(selectedTimeRange);
  }, [selectedTimeRange]);


  // --- Render Loading State ---
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="ml-4 text-lg text-gray-900">Memuat Dashboard...</p>
      </div>
    );
  }

  // --- Render Full Page Error State ---
  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">
          Gagal Memuat Dashboard
        </h2>
        <p className="text-red-600 text-center mb-6">{error}</p>
        <Button
          onClick={() => {
            if (error.includes("Otentikasi")) {
              localStorage.removeItem("token");
              window.location.href = "/login";
            } else {
              window.location.reload();
            }
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {error.includes("Otentikasi") ? "Ke Halaman Login" : "Coba Lagi"}
        </Button>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-white shadow-md p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        {error && <p className="text-red-600 mt-2">Peringatan: {error}</p>}
      </header>

      {/* --- Stat Cards Section --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Admin Aktif"
          value={stats?.activeAdmins ?? "..."}
          icon={<Users className="h-8 w-8 text-blue-600" />}
          isLoading={loading}
          linkTo="/superadmin/user"
        />
        <StatCard
          title="Permintaan Aktivasi"
          value={stats?.pendingActivations ?? "..."}
          icon={<Users className="h-8 w-8 text-green-600" />}
          isLoading={loading}
          linkTo="/superadmin/activation"
        />
        <StatCard
          title="Permintaan Ekstensi"
          value={stats?.pendingExtensions ?? "..."}
          icon={<Users className="h-8 w-8 text-orange-500" />}
          isLoading={loading}
          linkTo="/superadmin/extension"
        />
      </section>

      {/* --- Chart Section --- */}
      <section className="mb-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title Section */}
            <div className="flex items-center">
              <BarChart2 className="mr-3 h-6 w-6 text-gray-700" />
              <CardTitle className="text-gray-900 text-xl font-semibold">
                Statistik Aktivasi & Perpanjangan
              </CardTitle>
            </div>

            {/* Dropdown Section */}
            <div className="w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-[200px] justify-between truncate bg-custom-orange hover:bg-custom-orange/90 border-orange-300 text-white"
                  >
                    <span className="truncate">
                      {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || "Pilih Periode"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[200px] bg-white shadow-lg rounded-md border border-gray-200"
                  align={window.innerWidth < 640 ? 'start' : 'end'}
                >
                  {timeRangeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSelectedTimeRange(option.value)}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                        selectedTimeRange === option.value
                          ? "bg-orange-50 font-medium text-orange-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full mt-4">
              {loadingChart ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <p className="ml-2 text-gray-600">Memuat data grafik...</p>
                </div>
              ) : chartDataError ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
                  <p className="text-red-600 font-medium">Gagal Memuat Grafik</p>
                  <p className="text-sm text-gray-600 mt-1">{chartDataError}</p>
                </div>
              ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={formatXAxis}
                        interval={"preserveStartEnd"}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        allowDecimals={false}
                        domain={[0, (dataMax: number) => Math.max(Math.ceil(dataMax * 1.2), 5)]}
                      />
                      <ChartTooltip
                        cursor={{ stroke: "#a0a0a0", strokeWidth: 1, strokeDasharray: "3 3" }}
                        content={
                          <ChartTooltipContent
                            className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg text-black"
                            labelFormatter={formatXAxis}
                            labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                            indicator="line"
                          />
                        }
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ top: -10, right: 0 }}
                        iconSize={10}
                        formatter={(value) => (
                           <span style={{ color: '#4b5563' }}>{value}</span>
                        )}
                      />
                      <Line
                        dataKey="activations"
                        type="monotone"
                        stroke={chartConfig.activations.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: chartConfig.activations.color, stroke: '#fff', strokeWidth: 2 }}
                        name={chartConfig.activations.label}
                      />
                      <Line
                        dataKey="extensions"
                        type="monotone"
                        stroke={chartConfig.extensions.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: chartConfig.extensions.color, stroke: '#fff', strokeWidth: 2 }}
                        name={chartConfig.extensions.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Tidak ada data untuk ditampilkan pada periode ini.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// --- Sub-components ---
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
  <a
    href={linkTo}
    className="block hover:shadow-lg transition-shadow duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl"
    aria-label={`Lihat detail untuk ${title}`}
  >
    <Card className="border-gray-200 p-6 h-full cursor-pointer shadow-sm hover:border-orange-400 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 rounded-full p-3">{icon}</div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mt-1"></div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          )}
        </div>
      </div>
    </Card>
  </a>
);
