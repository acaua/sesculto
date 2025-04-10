import astroAdapter, { pageMap } from "../dist/_worker.js/index.js";

import { scheduled } from "@/cloudflare/scheduled";

const app = { ...astroAdapter, scheduled };

export { app as default, pageMap };
