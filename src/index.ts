/*
This is a workaround to export the scheduled handler
See: https://github.com/withastro/astro/issues/13153
*/

import astroAdapter, { pageMap } from "../dist/_worker.js/index.js";

import { scheduled } from "@/cloudflare/scheduled";

const app = { ...astroAdapter, scheduled };

export { app as default, pageMap };
