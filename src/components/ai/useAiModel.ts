"use client";
import { useCallback, useEffect, useState } from "react";
import { AI_MODEL_STORAGE_KEY, AiModelChoice, isAiModelChoice } from "./models";

const SYNC_EVENT = "zevqyn-ai-model-change";

function readStored(): AiModelChoice {
  try {
    const v = window.localStorage.getItem(AI_MODEL_STORAGE_KEY);
    if (isAiModelChoice(v)) return v;
  } catch {
    /* storage unavailable — fall through to default */
  }
  return "auto";
}

/**
 * AI model choice state. Defaults to "auto" for new users and persists the
 * last choice in localStorage. Multiple hook instances stay in sync via a
 * custom event (same tab) and the storage event (other tabs).
 */
export function useAiModel(): [AiModelChoice, (m: AiModelChoice) => void] {
  const [model, setModelState] = useState<AiModelChoice>("auto");

  useEffect(() => {
    setModelState(readStored());
    const sync = () => setModelState(readStored());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setModel = useCallback((m: AiModelChoice) => {
    if (!isAiModelChoice(m)) return;
    try {
      window.localStorage.setItem(AI_MODEL_STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
    setModelState(m);
  }, []);

  return [model, setModel];
}
