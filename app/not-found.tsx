import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="w-full h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
    >
      <h1 className="text-7xl font-extrabold tracking-tight text-primary">
        404
      </h1>

      <p className="text-xl font-semibold text-foreground">
        عذرًا، الصفحة غير موجودة
      </p>

      <p className="text-muted-foreground max-w-md">
        يبدو أن الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى مكان آخر.
      </p>

      <Button asChild size="lg" className="mt-4">
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </main>
  );
}
