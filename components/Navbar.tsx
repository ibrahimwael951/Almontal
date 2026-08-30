"use client";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Animate, FadeDown } from "@/Animate";

const Navbar = () => {
  return (
    <motion.nav
      {...FadeDown}
      {...Animate}
      className="fixed top-2 left-2/4 -translate-x-2/4 p-3 px-5 w-[96%] max-w-5xl rounded-xl bg-accent/50 backdrop-blur-2xl flex justify-between items-center gap-4 z-50"
    >
      <Link href="/">
        <h1 className="text-xl">ألمونتال</h1>
      </Link>

      <div className="flex justify-center items-center gap-2 ">
        <ModeToggle />
        <Button link="/kitchen">يلا نشوف المطبخ</Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
