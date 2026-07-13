"use client";

import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// Minimal shape of the browser's SpeechRecognition API (not in TS's DOM lib).
type Alternative = { transcript: string };
type Result = { isFinal: boolean; 0: Alternative };
type ResultList = { length: number; [index: number]: Result };
type RecognitionEvent = { resultIndex: number; results: ResultList };
type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};
type RecognitionConstructor = new () => Recognition;

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Browser speech-to-text. Chrome and Edge support it; Firefox does not, so callers
 * must hide the control when `supported` is false. Requires https or localhost.
 */
const noopSubscribe = () => () => {};

export function useDictation(onFinalText: (text: string) => void) {
  // SSR-safe browser support check: false in server HTML, the real answer after
  // hydration, with no state or effect involved.
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => getRecognitionConstructor() !== null,
    () => false
  );
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const callbackRef = useRef(onFinalText);
  const wantsToListenRef = useRef(false);

  // Insertion effects run before the browser can dispatch the next event, so a
  // speech result can never fire against the previous render's callback — which
  // would append to a stale value and silently drop the last dictated chunk.
  useInsertionEffect(() => {
    callbackRef.current = onFinalText;
  }, [onFinalText]);

  const stop = useCallback(() => {
    wantsToListenRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Constructor = getRecognitionConstructor();
    if (!Constructor) return;

    setError(null);
    const recognition = new Constructor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-GB";

    recognition.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
      }
      if (final.trim()) callbackRef.current(final.trim());
    };

    recognition.onerror = (event) => {
      // "no-speech" is a benign pause — keep listening. Anything else stops the
      // session: leaving wantsToListen set would make onend restart into the same
      // failure forever (e.g. "network" offline), and an "aborted" instance restarting
      // would fight whichever other dictation field just took over the microphone.
      if (event.error === "no-speech") return;
      wantsToListenRef.current = false;
      setListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone blocked. Allow access in your browser, then try again.");
      } else if (event.error !== "aborted") {
        setError(`Dictation stopped: ${event.error}`);
      }
    };

    // Chrome cuts the stream after a pause — restart while the user still wants it on.
    recognition.onend = () => {
      if (wantsToListenRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    wantsToListenRef.current = true;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("Could not start dictation.");
    }
  }, []);

  useEffect(() => {
    return () => {
      wantsToListenRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  return { supported, listening, error, start, stop };
}
