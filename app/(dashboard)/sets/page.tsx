import { getSeries } from "@/lib/tcgdex";
import SetsClient from "./SetsClient";

export const metadata = {
  title: "Browse Sets | TCG Tracker",
};

export default async function SetsPage() {
  const series = await getSeries();
  return <SetsClient series={series} />;
}