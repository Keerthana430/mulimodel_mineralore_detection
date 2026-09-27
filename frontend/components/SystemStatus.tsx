"use client";

import { useEffect, useState } from "react";

export function SystemStatus() {
  const [backendConnected, setBackendConnected] = useState(false);
  const [piConnected, setPiConnected] = useState(false);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ??
    "http://localhost:8000";

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/connection-status`, {
          signal: AbortSignal.timeout(2000), // timeout quickly if dead
        });
        if (res.ok) {
          const data = await res.json();
          setBackendConnected(data.backend === true);
          setPiConnected(data.pi === true);
        } else {
          setBackendConnected(false);
          setPiConnected(false);
        }
      } catch (error) {
        setBackendConnected(false);
        setPiConnected(false);
      }
    };

    // Check immediately
    checkStatus();
    // Then every 3 seconds
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <section className="mb-6 flex gap-4 shrink-0">
      <div className="flex flex-1 items-center justify-between rounded-lg border border-line/60 bg-base-850 px-5 py-3 shadow-sm">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Backend Server
        </span>
        <div className="flex items-center gap-2">
          {backendConnected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-indicator"></span>
              <span className="text-[11px] font-mono font-semibold text-ink-100">Connected</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-indicator"></span>
              <span className="text-[11px] font-mono font-semibold text-red-400">Disconnected</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between rounded-lg border border-line/60 bg-base-850 px-5 py-3 shadow-sm">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Edge Device (Pi)
        </span>
        <div className="flex items-center gap-2">
          {piConnected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-indicator" style={{ animationDelay: "1s" }}></span>
              <span className="text-[11px] font-mono font-semibold text-ink-100">Connected</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-indicator" style={{ animationDelay: "1s" }}></span>
              <span className="text-[11px] font-mono font-semibold text-red-400">Disconnected</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
