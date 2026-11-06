"use client";

import { useEffect, useRef, useState } from "react";
import { fetchBrickPage } from "@/lib/guestbook/client";
import type { BrickNote } from "@/lib/guestbook/types";

/* Every approved message, newest first, loaded a page at a time.
   Also the plain-text way to read the guestbook without the physics pit. */

const PAGE = 30;
const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function AllBricks({ open, onClose, total }: { open: boolean; onClose: () => void; total: number | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState<BrickNote[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const loadMore = async (reset = false) => {
    setState("loading");
    try {
      const { notes: page, done } = await fetchBrickPage(PAGE, reset ? undefined : notes[notes.length - 1]);
      setNotes((n) => (reset ? page : [...n, ...page]));
      setState(done ? "done" : "idle");
    } catch {
      setState("error");
    }
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      void loadMore(true);
    } else if (!open && d.open) d.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="gb-dialog"
      aria-labelledby="gb-all-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      <div className="gb-dialog-head">
        <h3 id="gb-all-title">
          Every brick in the build{total !== null && <span> · {total}</span>}
        </h3>
        <button type="button" className="gb-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      <ul className="gb-list">
        {notes.map((n) => (
          <li key={n.id}>
            <span className={`gb-list-chip gb-dot--${n.color}`} aria-hidden="true" />
            <div>
              <strong>{n.name}</strong>
              {!n.isSeed && n.createdAt > 0 && <time dateTime={new Date(n.createdAt).toISOString()}>{formatDate(n.createdAt)}</time>}
              <p>{n.message}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="gb-dialog-foot">
        {state === "loading" && <span>Loading bricks…</span>}
        {state === "error" && <span>Couldn&apos;t load messages. Try again in a moment.</span>}
        {state === "idle" && notes.length > 0 && (
          <button type="button" className="lego-btn lego--white lego-btn--sm" onClick={() => loadMore()}>
            Load older bricks
          </button>
        )}
        {state === "done" && <span>That&apos;s every brick so far.</span>}
      </div>
    </dialog>
  );
}
