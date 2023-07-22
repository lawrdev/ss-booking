"use client";

import { BookingTemplate } from "@/components/templates";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Book Delivery</title>
        <meta
          name="description"
          content="Book delivery to multiple locations"
        />
      </Head>

      <BookingTemplate />
    </>
  );
}
