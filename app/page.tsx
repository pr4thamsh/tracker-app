"use client";
import { useState, useEffect } from "react";
import { BusRoute } from "./types";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { PushPinSimple } from "@phosphor-icons/react";

export default function Home() {
  const [busRoutes, setBusRoutes] = useState<Array<BusRoute> | null>(null);

  const fetchBusInfo = async () => {
    const res = await fetch("https://www.metrobus.co.ca/api/timetrack/json/");
    const result = await res.json();
    setBusRoutes(result);
  };

  useEffect(() => {
    fetchBusInfo();
    const interval = setInterval(fetchBusInfo, 100000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col min-h-screen p-4 lg:px-24">
      {busRoutes && (
        <Accordion variant="splitted">
          {busRoutes.map((route, index) => (
            <AccordionItem
              key={index}
              title={
                <span className="font-bold text-blue-600">
                  Route {route.routerunshort}
                </span>
              }
            >
              {JSON.stringify(route)}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}
