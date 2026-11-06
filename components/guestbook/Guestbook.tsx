"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import seedData from "@/data/brick-seeds.json";
import { countBricks, guestbookConfigured, watchBricks } from "@/lib/guestbook/client";
import { LAYOUTS } from "@/lib/guestbook/layouts";
import { isColor, isShape, type BrickNote } from "@/lib/guestbook/types";
import { LooseBrick } from "../LegoBits";
import AllBricks from "./AllBricks";
import BrickForm from "./BrickForm";
import { BrickDefs } from "./BrickSvg";
import { createThud } from "./sound";

// Matter.js + the pit only load once the guestbook is close to the screen
const BrickPit = dynamic(() => import("./BrickPit"), { ssr: false, loading: () => <PitPlaceholder /> });

const MINE_KEY = "ebze-guestbook:mine";
const MINE_TTL = 30 * 24 * 60 * 60 * 1000;

const STARTERS: BrickNote[] = seedData
  .filter((s) => isColor(s.color) && isShape(s.shape))
  .map((s) => ({ ...s, createdAt: Date.parse(s.createdAt), isSeed: true, status: "approved" }) as BrickNote);

type Load = "idle" | "loading" | "ready" | "error" | "offline";

function readMine(): BrickNote[] {
  try {
    const list = JSON.parse(localStorage.getItem(MINE_KEY) || "[]") as BrickNote[];
    return list.filter((n) => Date.now() - n.createdAt < MINE_TTL && isColor(n.color) && isShape(n.shape));
  } catch {
    return [];
  }
}
function writeMine(list: BrickNote[]) {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(list));
  } catch {
    /* private mode: the brick still shows until the page is closed */
  }
}

function PitPlaceholder({ text = "Laying the bricks…" }: { text?: string }) {
  return (
    <div className="gb-pit gb-pit--placeholder">
      <span>{text}</span>
    </div>
  );
}

export default function Guestbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [load, setLoad] = useState<Load>("idle");
  const [approved, setApproved] = useState<BrickNote[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [mine, setMine] = useState<BrickNote[]>([]);
  const [shownMax, setShownMax] = useState<number>(LAYOUTS.wide.maxBricks);
  const [browse, setBrowse] = useState(false);
  const [sound, setSound] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const thud = useRef<ReturnType<typeof createThud> | null>(null);

  /* start loading when the section is about a screen away */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    setMine(readMine());
    return () => mq.removeEventListener("change", update);
  }, []);

  /* live approved bricks + the real count */
  useEffect(() => {
    if (!near) return;
    if (!guestbookConfigured) {
      setApproved(STARTERS);
      setLoad("offline");
      return;
    }
    setLoad("loading");
    let alive = true;
    const stop = watchBricks(
      LAYOUTS.wide.maxBricks,
      (notes) => {
        if (!alive) return;
        setApproved(notes);
        setLoad("ready");
        countBricks()
          .then((n) => alive && setCount(n))
          .catch(() => alive && setCount(null));
      },
      (err) => {
        if (!alive) return;
        console.error("Guestbook failed to load", err);
        setApproved((a) => (a.length ? a : STARTERS));
        setLoad("error");
      },
    );
    return () => {
      alive = false;
      stop();
    };
  }, [near]);

  /* once my pending brick is approved, it comes from Firestore instead */
  useEffect(() => {
    if (!approved.length) return;
    const ids = new Set(approved.map((n) => n.id));
    setMine((m) => {
      const left = m.filter((n) => !ids.has(n.id));
      if (left.length !== m.length) writeMine(left);
      return left.length !== m.length ? left : m;
    });
  }, [approved]);

  const notes = useMemo(() => {
    const ids = new Set(approved.map((n) => n.id));
    return [...approved, ...mine.filter((n) => !ids.has(n.id))].sort((a, b) => b.createdAt - a.createdAt);
  }, [approved, mine]);
  const pendingIds = useMemo(() => new Set(mine.map((n) => n.id)), [mine]);

  const onDropped = useCallback((note: BrickNote) => {
    setMine((m) => {
      const next = [...m.filter((n) => n.id !== note.id), note];
      writeMine(next);
      return next;
    });
  }, []);

  const toggleSound = () => {
    if (!thud.current) thud.current = createThud();
    setSound((s) => !s);
  };
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const onLand = useCallback((speed: number) => {
    if (soundRef.current) thud.current?.(speed);
  }, []);

  const ready = load === "ready" || load === "offline" || load === "error";
  const hidden = count !== null ? Math.max(0, count - Math.min(shownMax, approved.length)) : 0;

  return (
    <section id="guestbook" className="guestbook" ref={sectionRef} aria-labelledby="gb-title">
      <BrickDefs />
      <div className="gb-deco" aria-hidden="true">
        <div className="gb-deco-yellow bob">
          <LooseBrick color="yellow" rx={-30} ry={-34} rz={12} size={0.95} />
        </div>
        <div className="gb-deco-blue bob bob--slow">
          <LooseBrick color="blue" rx={-28} ry={32} rz={-10} size={0.8} />
        </div>
      </div>

      <div className="gb-inner">
        <span className="work-eyebrow">
          <span className="eyebrow-bricks" aria-hidden="true">
            <LooseBrick color="red" rx={-30} ry={34} size={0.55} />
          </span>
          Guestbook
        </span>

        <h2 id="gb-title" className="gb-heading">
          Leave your brick<span className="hero-dot">.</span> <span className="gb-heading-emoji" aria-hidden="true">🧱</span>
        </h2>
        <p className="gb-intro">Every great build starts with a brick. Leave yours and become part of mine.</p>

        <BrickForm
          onDropped={onDropped}
          disabled={load === "offline"}
          disabledNote="The guestbook is being wired up. Check back soon to leave your brick."
        />

        <div className="gb-pit-head">
          <p className="gb-count" aria-live="polite">
            {count !== null ? (
              <>
                🧱 <strong>{count.toLocaleString("en-GB")}</strong> {count === 1 ? "brick" : "bricks"} placed. Thanks for
                building with me.
              </>
            ) : load === "error" ? (
              "Couldn't reach the guestbook right now, so here are the starter bricks."
            ) : load === "offline" ? (
              "A sneak peek at the build. Visitor bricks are coming soon."
            ) : (
              " "
            )}
          </p>
          <div className="gb-pit-tools">
            {load === "ready" && (
              <button type="button" className="gb-link" onClick={() => setBrowse(true)}>
                {hidden > 0 ? `See all ${count} messages` : "Read all messages"}
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </button>
            )}
            <button type="button" className="gb-sound" aria-pressed={sound} onClick={toggleSound}>
              <i className={`fas ${sound ? "fa-volume-high" : "fa-volume-xmark"}`} aria-hidden="true"></i>
              <span className="sr-only">Brick sounds</span>
            </button>
          </div>
        </div>

        {near && ready ? (
          <BrickPit
            notes={notes}
            pendingIds={pendingIds}
            reducedMotion={reducedMotion}
            onLand={onLand}
            onLayout={setShownMax}
          />
        ) : (
          <PitPlaceholder />
        )}
        {hidden > 0 && (
          <p className="gb-pit-note">
            Showing the newest {Math.min(shownMax, approved.length)} bricks. {hidden} older{" "}
            {hidden === 1 ? "one is" : "ones are"} in the full list.
          </p>
        )}
      </div>

      {load === "ready" && <AllBricks open={browse} onClose={() => setBrowse(false)} total={count} />}
    </section>
  );
}
