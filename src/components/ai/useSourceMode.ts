"use client";
import { useCallback, useEffect, useState } from "react";
import { SOURCE_MODE_STORAGE_KEY, SourceMode, isSourceMode } from "./sourceModes";

const SYNC_EVENT = "zevqyn-source-mode-change";

function readStored(): SourceMode {
  try {
    const v = window.localStorage.getItem(SOURCE_MODE_STORAGE_KEY);
    if (isSourceMode(v)) return v;
  } catch {
    /* storage unavailable — fall through to default */
  }
  return "documents";
}

/**
 * Research Studio source-mode state. Defaults to "documents" for new users
 * (existing document-only behavior preserved) and persists the last choice
 * in localStorage. Multiple hook instances stay in sync via a custom event
 * (same tab) and the storage event (other tabs).
 */
export function useSourceMode(): [SourceMode, (m: SourceMode) => void] {
  const [mode, setModeState] = useState<SourceMode>("documents");

  useEffect(() => {
    setModeState(readStored());
    const sync = () => setModeState(readStored());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setMode = useCallback((m: SourceMode) => {
    if (!isSourceMode(m)) return;
    try {
      window.localStorage.setItem(SOURCE_MODE_STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
    setModeState(m);
  }, []);

  return [mode, setMode];
}
