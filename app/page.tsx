"use client";
import { useState, useEffect } from "react";
import { BusRoute } from "./types";

export default function Home() {
  const [busRoutes, setBusRoutes] = useState<Array<BusRoute> | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchBusInfo = async () => {
    const res = await fetch("https://www.metrobus.co.ca/api/timetrack/json/");
    const result = await res.json();
    setBusRoutes(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusInfo();
    const interval = setInterval(fetchBusInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  return <main className="flex flex-col min-h-screen"></main>;
}
