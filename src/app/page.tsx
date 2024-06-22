import Image from "next/image";
import Button from "@/components/Button";
import db from "@/utils/db";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>Hello</Button>
    </main>
  );
}
