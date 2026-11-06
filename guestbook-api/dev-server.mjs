/* Runs the endpoint locally against the Firestore emulator:
   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node guestbook-api/dev-server.mjs */
import { createServer } from "node:http";

process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
process.env.FIREBASE_PROJECT_ID ||= "demo-ebze";
const { default: handler } = await import("./api/submit-brick.js");

createServer((req, res) => {
  if (!req.url.startsWith("/api/submit-brick")) {
    res.statusCode = 404;
    res.end();
    return;
  }
  handler(req, res);
}).listen(8787, () => console.log("submit-brick on http://127.0.0.1:8787/api/submit-brick"));
