import type { MetadataRoute } from "next"

import { createPwaManifest } from "@/lib/pwa/config"

export default function manifest(): MetadataRoute.Manifest {
  return createPwaManifest()
}
