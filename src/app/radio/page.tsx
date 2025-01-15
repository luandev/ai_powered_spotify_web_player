import { HydrateClient } from "@/trpc/server";
import React from "react";
import RadioApp from "../_components/radio/radioApp";

export default function Radio() {
  return (
    <HydrateClient>
      <RadioApp />
    </HydrateClient>
  );
}
