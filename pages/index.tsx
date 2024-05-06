import Card from "@/components/Card";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const MenuList: { label: string; href: string }[] = [
  { label: "counter", href: "/counter" },
  { label: "spl-token", href: "/spl-token" },
];

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between pt-8 ${inter.className}`}
    >
      <div className="grid grid-cols-3 gap-6">
        {MenuList.map((item) => (
          <Card key={item.label} label={item.label} href={item.href} />
        ))}
      </div>
    </main>
  );
}
