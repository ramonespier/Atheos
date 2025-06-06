// components/SplashScreen.tsx
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-yellow-400">
      <div className="flex items-center space-x-3 text-2xl font-semibold">
        <span>Carregando</span>
        <div className="w-6 h-6 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
