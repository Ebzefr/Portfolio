"use client";

import { useRef, useState, type FormEvent } from "react";
import { submitBrick } from "@/lib/guestbook/client";
import { COLORS, SHAPES } from "@/lib/guestbook/shapes";
import {
  BRICK_COLORS,
  BRICK_SHAPES,
  MESSAGE_MAX,
  NAME_MAX,
  type BrickColor,
  type BrickNote,
  type BrickShape,
} from "@/lib/guestbook/types";
import { BrickSvg } from "./BrickSvg";

type Field = "name" | "message" | "color" | "shape";
type Props = { disabled?: boolean; disabledNote?: string; onDropped: (note: BrickNote) => void };

const len = (s: string) => Array.from(s).length;

export default function BrickForm({ disabled, disabledNote, onDropped }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<BrickColor>("red");
  const [shape, setShape] = useState<BrickShape>("rect2x4");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<{ kind: "idle" | "sending" | "done" | "error"; text?: string }>({ kind: "idle" });
  const openedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const lastSent = useRef("");

  const markStarted = () => {
    if (!openedAt.current) openedAt.current = Date.now();
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    const n = name.trim();
    const m = message.trim();
    if (!n) e.name = "Add your name.";
    else if (len(n) > NAME_MAX) e.name = `Keep your name to ${NAME_MAX} characters.`;
    if (len(m) < 2) e.message = "Write a short message.";
    else if (len(m) > MESSAGE_MAX) e.message = `Keep it to ${MESSAGE_MAX} characters.`;
    return e;
  };

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (state.kind === "sending" || disabled) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setState({ kind: "idle" });
      return;
    }
    const key = `${name.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
    if (key === lastSent.current) {
      setState({ kind: "error", text: "You've already dropped this brick." });
      return;
    }

    setState({ kind: "sending" });
    const res = await submitBrick({
      name: name.trim(),
      message: message.trim(),
      color,
      shape,
      website: honeypot.current?.value ?? "",
      elapsedMs: openedAt.current ? Date.now() - openedAt.current : 0,
    });

    if (!res.ok) {
      setErrors(res.errors ?? {});
      setState({ kind: "error", text: res.message });
      return;
    }
    lastSent.current = key;
    onDropped({
      id: res.id,
      name: name.trim(),
      message: message.trim(),
      color,
      shape,
      createdAt: Date.now(),
      isSeed: false,
      status: "pending",
    });
    setMessage("");
    setErrors({});
    setState({ kind: "done" });
  }

  const sending = state.kind === "sending";

  return (
    <form className="gb-form" onSubmit={onSubmit} onFocus={markStarted} noValidate>
      <div className="gb-fields">
        <label className="gb-field">
          <span className="gb-label">Your name</span>
          <input
            type="text"
            name="name"
            autoComplete="given-name"
            maxLength={NAME_MAX}
            placeholder="e.g. Amina"
            value={name}
            disabled={disabled}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "gb-err-name" : undefined}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span id="gb-err-name" className="gb-error">{errors.name}</span>}
        </label>

        <label className="gb-field gb-field--msg">
          <span className="gb-label">
            Your message
            <span className="gb-counter" aria-hidden="true">
              {len(message)}/{MESSAGE_MAX}
            </span>
          </span>
          <textarea
            name="message"
            rows={1}
            maxLength={MESSAGE_MAX}
            placeholder="Say hi, leave a tip, or just leave your mark…"
            value={message}
            disabled={disabled}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "gb-err-message" : undefined}
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <span id="gb-err-message" className="gb-error">{errors.message}</span>}
        </label>
      </div>

      {/* hidden from people; bots tend to fill it in */}
      <input ref={honeypot} className="gb-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="gb-pickers">
        <fieldset className="gb-picker" disabled={disabled}>
          <legend className="gb-label">Brick colour</legend>
          <div className="gb-swatches">
            {BRICK_COLORS.map((c) => (
              <label key={c} className="gb-swatch" title={COLORS[c].label}>
                <input type="radio" name="color" value={c} checked={color === c} onChange={() => setColor(c)} />
                <span className={`gb-swatch-chip gb-dot--${c}`} aria-hidden="true" />
                <span className="sr-only">{COLORS[c].label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="gb-picker" disabled={disabled}>
          <legend className="gb-label">Brick shape</legend>
          <div className="gb-shapes">
            {BRICK_SHAPES.map((s) => (
              <label key={s} className="gb-shape" title={SHAPES[s].label}>
                <input type="radio" name="shape" value={s} checked={shape === s} onChange={() => setShape(s)} />
                <span className="gb-shape-tile" aria-hidden="true">
                  <BrickSvg shape={s} color={color} />
                </span>
                <span className="sr-only">{SHAPES[s].label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="lego-btn lego--red gb-submit" disabled={disabled || sending}>
          {sending ? "Dropping…" : "Drop my brick"}
          <i className={`fas ${sending ? "fa-spinner fa-spin" : "fa-arrow-down"} lego-btn-arrow`} aria-hidden="true"></i>
        </button>
      </div>

      <p className={`gb-status gb-status--${state.kind}`} role="status" aria-live="polite">
        {disabled && disabledNote}
        {!disabled && state.kind === "done" && (
          <>
            <strong>Your brick is officially part of the build! 🧱</strong>
            <span>Everyone else will see it once I&apos;ve approved it.</span>
          </>
        )}
        {!disabled && state.kind === "error" && state.text}
      </p>
    </form>
  );
}
