"use client";
import { useState, useEffect } from "react";
import { BusRoute, BusRouteParent } from "./types";
import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { MapPin } from "@phosphor-icons/react";

export default function Home() {
  const [busRouteMaster, setBusRouteMaster] =
    useState<Array<BusRouteParent> | null>(null);

  const fetchBusInfo = async () => {
    try {
      const response = await fetch(
        "https://www.metrobus.co.ca/api/timetrack/json/"
      );
      const busRoutes: BusRoute[] | null = await response.json();

      if (busRoutes) {
        const routeMap = new Map<number, BusRoute[]>();

        busRoutes.forEach((route) => {
          if (!routeMap.has(route.routenumber)) {
            routeMap.set(route.routenumber, []);
          }
          routeMap.get(route.routenumber)?.push(route);
        });

        const masterArray: BusRouteParent[] = Array.from(
          routeMap,
          ([routenumber, routes]) => ({
            routenumber,
            routes,
          })
        );

        setBusRouteMaster(masterArray);
      } else {
        setBusRouteMaster(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBusInfo();
    const interval = setInterval(fetchBusInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col min-h-screen p-4 lg:px-24">
      {/* <div className="flex justify-center items-center">
        <Select items={busRouteMaster ? busRouteMaster : []}>
          <SelectItem key={busRouteMaster ? busRouteMaster[0].routenumber : 0}>
            {busRouteMaster ? busRouteMaster[0].routenumber : 0}
          </SelectItem>
        </Select>
      </div> */}
      {busRouteMaster && (
        <Accordion variant="splitted">
          {busRouteMaster.map((routeMaster) => (
            <AccordionItem
              aria-label={routeMaster.routenumber.toString()}
              key={routeMaster.routenumber}
              title={
                <span className="font-bold text-blue-600">
                  Route {routeMaster.routenumber}
                </span>
              }
            >
              <Accordion variant="bordered">
                {routeMaster.routes.map((route) => (
                  <AccordionItem
                    key={route.routerun}
                    aria-label={route.routerun}
                    startContent={route.routerunshort}
                    title={
                      <span className="font-bold text-blue-600">
                        {route.gtfs_trip_headsign}
                      </span>
                    }
                    subtitle={
                      <span className="font-semibold flex items-center gap-1">
                        <MapPin /> {route.current_location} @ {route.time_stamp}
                      </span>
                    }
                  >
                    {JSON.stringify(route)}
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}
