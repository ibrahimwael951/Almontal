import About from "@/components/Home/About";
import HaveAPlan from "@/components/Home/HaveAPlan";
import Hero from "@/components/Home/Hero";
import OldKitchen from "@/components/Home/OldKitchen";
import SimpleKitchen from "@/components/Home/SimpleKitchen";

export default function Page() {
  return (
    <main dir="rtl" className="w-full min-h-screen ">
      <Hero />
      <About />
      <OldKitchen />
      <SimpleKitchen />
      <HaveAPlan />
    </main>
  );
}
