'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home'); // điều hướng sau 5 giây
    }, 5000);

    return () => clearTimeout(timer); // dọn dẹp nếu component bị unmount
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-2xl font-bold text-center">
        Chat Web Realtime
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg mt-4">Welcome to the Chat Web Realtime!</p>
        <p className="text-sm text-gray-400 mt-2">Đang chuyển hướng...</p>
      </div>
      <div className="text-sm text-gray-500 text-center">
        &copy; 2025 Chat Web Realtime. All rights reserved.
      </div>
    </div>
  );
}
