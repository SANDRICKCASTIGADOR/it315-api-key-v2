import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/keys");
}