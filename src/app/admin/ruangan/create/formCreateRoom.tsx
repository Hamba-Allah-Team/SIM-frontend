"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import  ImageDropzone  from "@/components/imageDropZone";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({ 
  place_name: z.string().min(1, { message: "Nama ruangan harus diisi" }),
  capacity: z.coerce.number().min(1, { message: "Kapasitas harus lebih dari 0" }),
  facilities: z.string().min(1, { message: "Fasilitas harus diisi" }),
  description: z.string().min(1, { message: "Deskripsi ruangan harus diisi" }),
  image: z.any().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageUploadField = ({ field }: any) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleDropImage = (file: File) => {
    if (file) {
      field.onChange(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleDelete = () => {
    field.onChange(null);
    setPreviewUrl(null);
    setFileName("");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <FormItem>
      <FormLabel className="text-[16px] font-semibold font-poppins text-black">
          Gambar Ruangan
      </FormLabel>
      <FormControl>
        {previewUrl ? (
          <div className="relative mb-4">
            <div className="relative w-full">
              <input 
                type="text"
                value={typeof fileName === "string" ? fileName : ""}
                readOnly
                placeholder="Nama gambar"
                className="w-full border rounded-md py-2 pl-9 pr-9 text-sm bg-gray-100 cursor-not-allowed text-gray-600"
              />
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Hapus gambar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Link className="w-5 h-5" />
              </div>
            </div>
            <img 
                src={previewUrl} 
                alt="Preview" 
                className="mt-2 w-full h-auto rounded-md object-cover"
            />
          </div>
        ) : (
          <ImageDropzone onDropImage={handleDropImage} />
        )}
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function FormCreateRoom() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      place_name: "",
      description: "",
      capacity: undefined,
      facilities: "",
      image: "",
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
      const formData = new FormData();
  
      formData.append("place_name", values.place_name);
      formData.append("description", values.description);
      formData.append("capacity", values.capacity.toString());
      formData.append("facilities", values.facilities);
      if (values.image) {
        formData.append("image", values.image);
      }

      const token = localStorage.getItem("token");

      fetch(`${API}/api/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`, // pakai token jika ada
        },
        body: formData,
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Gagal mengirim data");
          }
          return res.json();
        })
        .then(() => {
          toast.success("Ruangan berhasil ditambah", {
            style: {
              background: "white",
              color: "black",
              border: "2px solid #22c55e",
            },
          });
          router.push("/admin/ruangan");
        })
        .catch((err) => {
          console.error("Error submit:", err);
          toast.error("Gagal menyimpan ruangan: " + err.message, {
            style: {
              background: "#white", 
              color: "black",
              border: "2px solid #ef4444"
            },
          });
        });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Place Name */}
        <FormField
          control={form.control}
          name="place_name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Nama Ruangan
              </FormLabel>
              <FormControl>
                  <Input 
                    placeholder={fieldState.error ? fieldState.error.message : "Nama Ruangan disini"} 
                    {...field}
                    className={`
                      bg-white
                      text-black
                      ${ fieldState.error 
                        ? "border-red-500 placeholder-red-50" 
                        : "border-gray-300 placeholder-gray-400" 
                      }
                      pr-10
                    `}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Kapasitas
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder={fieldState.error ? fieldState.error.message : "Kapasitas Ruangan"} 
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Facilities */}
        <FormField
          control={form.control}
          name="facilities"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Fasilitas
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={fieldState.error ? fieldState.error.message : "Fasilitas Ruangan disini"} 
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        { /* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Deskripsi Ruangan
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={fieldState.error ? fieldState.error.message : "Deskripsi Ruangan disini"} 
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <ImageUploadField field={field} />
          )}
        />

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/ruangan")}
            className="flex-1 h-9 justify-center items-center px-4 py-2 border rounded-md text-[16px] font-bold text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50"
          >
            Batal
          </button>
          <Button 
            type="submit"
            className="flex-1 h-9 px-4 py-2 text-[16px] font-bold bg-orange-500 text-white shadow-xs hover:bg-orange-600 focus-visible:ring-orange-300"
          >
            Simpan
          </Button>
        </div>
      </form>  
    </Form>
  );
}
