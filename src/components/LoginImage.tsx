"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginImage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Image
        src="/masjid-icon.png"
        alt="Login Image"
        width={1000}
        height={1000}
      />
    </div>
  );
}