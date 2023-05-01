import { Router } from "itty-router";
import { getRepoSize } from "./utils.js";

const router = Router();

router.get("/schema/:user/:repo", async ({ params }) => {
  let schema = await getRepoSize(params.user, params.repo);
  if (schema.status != undefined) {
    return new Response(schema.error, { status: schema.status });
  }

  return new Response(schema);
});

router.get("/depsize/:user/:repo", async ({ params }) => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://img.shields.io/endpoint?url=https://depsize.grubby.workers.dev/schema/${params.user}/${params.repo}?cacheSeconds=3600`,
    },
  });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);
