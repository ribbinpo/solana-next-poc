import { useRouter } from "next/router";
import { FC } from "react";

const Card: FC<{ label: string; href: string }> = ({ label, href }) => {
  const router = useRouter();
  return (
    <a
      onClick={() => router.push(href)}
      className="rounded-md w-48 h-28 bg-slate-700 flex items-center justify-center text-center cursor-pointer"
    >
      <p>{label}</p>
    </a>
  );
};

export default Card;
