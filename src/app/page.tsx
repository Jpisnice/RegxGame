import Image from "next/image";
import Game from '@/app/game/page'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-1 p-3 border-2 border-black">
      <Game></Game>
    </main>
  );
}
