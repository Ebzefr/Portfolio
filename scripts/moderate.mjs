/* Guestbook moderation.
     node scripts/moderate.mjs list              pending bricks (⚑ = flagged words)
     node scripts/moderate.mjs approve <id...>   show them on the site
     node scripts/moderate.mjs reject <id...>    hide them
     node scripts/moderate.mjs approve-clean     approve every pending brick that isn't flagged
     node scripts/moderate.mjs approved          the 20 most recent approved bricks */
import { notes } from "./admin.mjs";

const [cmd, ...ids] = process.argv.slice(2);
const when = (d) => d.get("createdAt")?.toDate().toISOString().slice(0, 16).replace("T", " ") ?? "";
const line = (d) => `${d.get("flagged") ? "⚑" : " "} ${d.id}  ${when(d)}  ${d.get("name")}: ${d.get("message")}`;

async function setStatus(status, list) {
  for (const id of list) {
    const ref = notes.doc(id);
    const snap = await ref.get();
    if (!snap.exists) console.log(`✗ ${id} not found`);
    else {
      await ref.update({ status });
      console.log(`✓ ${id} → ${status}`);
    }
  }
}

if (cmd === "list") {
  const snap = await notes.where("status", "==", "pending").get();
  console.log(snap.empty ? "No pending bricks." : snap.docs.map(line).join("\n"));
} else if (cmd === "approved") {
  const snap = await notes.where("status", "==", "approved").orderBy("createdAt", "desc").limit(20).get();
  console.log(snap.docs.map(line).join("\n"));
} else if ((cmd === "approve" || cmd === "reject") && ids.length) {
  await setStatus(cmd === "approve" ? "approved" : "rejected", ids);
} else if (cmd === "approve-clean") {
  const snap = await notes.where("status", "==", "pending").where("flagged", "==", false).get();
  await setStatus("approved", snap.docs.map((d) => d.id));
} else {
  console.log("Usage: node scripts/moderate.mjs list | approved | approve <id...> | reject <id...> | approve-clean");
  process.exitCode = 1;
}
