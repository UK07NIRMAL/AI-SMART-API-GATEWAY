/**
 * pages/PlaygroundPage.jsx
 * Interactive API request builder with response viewer.
 */

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { playgroundService } from "../services/api";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const SAMPLE_ENDPOINTS = [
  { label: "/v2/neural/inference/async", method: "POST", active: true },
  { label: "/v2/neural/gate/status", method: "GET", active: false },
  { label: "/v2/config/weights/update", method: "PUT", active: false },
  { label: "/v2/nodes/purge/cluster_alpha", method: "DELETE", active: false },
];

const DEFAULT_HEADERS = `{
  "Authorization": "Bearer ng_live_YOUR_KEY",
  "Content-Type": "application/json",
  "X-NeuroGate-Version": "2024-05-24"
}`;

const DEFAULT_BODY = `{
  "model": "neural-v4",
  "input": {
    "prompt": "Analyze the sentiment of this text.",
    "context_window": 8192
  },
  "stream": false,
  "temperature": 0.7
}`;

const MOCK_RESPONSE = {
  status: 200,
  latency: "42ms",
  size: "1.2 KB",
  body: `{
  "id": "resp_neural_9k2x8j1",
  "model": "neural-v4",
  "created": 1716566521,
  "output": {
    "sentiment": "positive",
    "confidence": 0.942,
    "tokens_used": 128
  },
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 110,
    "total_tokens": 128
  },
  "latency_ms": 42,
  "gateway_node": "eu-west-2a"
}`,
};

const ACTIVE_TAB_STYLE = "border-b-2 border-primary text-primary";
const INACTIVE_TAB_STYLE =
  "border-b-2 border-transparent text-on-surface-variant hover:text-on-surface";

export default function PlaygroundPage() {
  const [method, setMethod] = useState("POST");
  const [url, setUrl] = useState(
    "https://api.neurogate.ai/v2/neural/inference/async",
  );
  const [activeTab, setActiveTab] = useState("headers");
  const [headersText, setHeadersText] = useState(DEFAULT_HEADERS);
  const [bodyText, setBodyText] = useState(DEFAULT_BODY);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const handleSend = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      let headers = {};
      let body = undefined;
      try {
        headers = JSON.parse(headersText);
      } catch {
        /* ignore */
      }
      if (method !== "GET" && method !== "DELETE") {
        try {
          body = JSON.parse(bodyText);
        } catch {
          /* ignore */
        }
      }
      const { data } = await playgroundService.execute({
        method,
        url,
        headers,
        body,
      });
      setResponse({
        status: data.status || 200,
        latency: data.latency || "—",
        size: data.size || "—",
        body: JSON.stringify(data.response || data, null, 2),
      });
    } catch {
      // Use mock response when backend not connected
      setResponse(MOCK_RESPONSE);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectEndpoint = (i) => {
    setSelectedEndpoint(i);
    const ep = SAMPLE_ENDPOINTS[i];
    setUrl(`https://api.neurogate.ai${ep.label}`);
    setMethod(ep.method);
  };

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row h-full min-h-screen">
        {/* ── Left sidebar: Endpoint History ── */}
        <aside className="w-full lg:w-72 bg-surface-container-low border-r border-outline-variant/10 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-outline-variant/5 flex items-center justify-between">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              Endpoints
            </span>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {SAMPLE_ENDPOINTS.map((ep, i) => (
              <button
                key={i}
                onClick={() => selectEndpoint(i)}
                className={`w-full p-3 rounded-lg text-left group cursor-pointer transition-colors ${
                  selectedEndpoint === i
                    ? "bg-surface-container-highest border-l-2 border-primary"
                    : "hover:bg-surface-container-highest/50 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold font-label px-1.5 py-0.5 rounded ${
                      ep.method === "GET"
                        ? "text-primary bg-primary/10"
                        : ep.method === "POST"
                          ? "text-secondary bg-secondary/10"
                          : ep.method === "DELETE"
                            ? "text-error bg-error/10"
                            : "text-tertiary bg-tertiary/10"
                    }`}
                  >
                    {ep.method}
                  </span>
                </div>
                <div className="text-xs truncate font-mono text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {ep.label}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page header */}
          <header className="bg-surface-container-low px-8 py-6 border-b border-outline-variant/5 flex items-center justify-between">
            <div>
              <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-1 block">
                Developer Tools
              </span>
              <h2 className="font-headline font-bold text-xl tracking-tight text-on-surface">
                API Playground
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                Live Mode
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            {/* ── Request Builder ── */}
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
              {/* URL Bar */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="bg-surface-container-high text-primary font-mono text-sm px-4 py-3 rounded-lg focus:ring-1 focus:ring-primary outline-none appearance-none pr-8 cursor-pointer min-w-[110px]"
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[14px]">
                    expand_more
                  </span>
                </div>

                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter endpoint URL…"
                  className="flex-1 bg-surface-container-high text-on-surface font-mono text-sm px-4 py-3 rounded-lg focus:ring-1 focus:ring-primary outline-none placeholder:text-on-surface-variant/30"
                />

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-headline font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 hover:brightness-110 disabled:opacity-60 flex-shrink-0"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">
                      send
                    </span>
                  )}
                  {loading ? "Sending…" : "Send"}
                </button>
              </div>

              {/* Request Tabs */}
              <div className="border-b border-outline-variant/10 flex gap-8 mb-5">
                {[
                  { id: "headers", label: "Headers" },
                  { id: "body", label: "Body (JSON)" },
                  { id: "auth", label: "Auth" },
                  { id: "params", label: "Query Params" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`pb-3 text-[10px] font-mono uppercase tracking-widest transition-colors ${activeTab === id ? ACTIVE_TAB_STYLE : INACTIVE_TAB_STYLE}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/10 font-mono text-xs min-h-[180px]">
                {activeTab === "headers" && (
                  <textarea
                    value={headersText}
                    onChange={(e) => setHeadersText(e.target.value)}
                    className="w-full h-full bg-transparent text-on-surface-variant outline-none resize-none leading-relaxed min-h-[160px]"
                    spellCheck={false}
                  />
                )}
                {activeTab === "body" && (
                  <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full h-full bg-transparent text-on-surface-variant outline-none resize-none leading-relaxed min-h-[160px]"
                    spellCheck={false}
                  />
                )}
                {activeTab === "auth" && (
                  <div className="space-y-3 py-2">
                    <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-4">
                      Bearer Token
                    </p>
                    <input
                      type="text"
                      placeholder="ng_live_YOUR_API_KEY"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-on-surface outline-none focus:ring-1 focus:ring-primary placeholder:text-outline"
                    />
                  </div>
                )}
                {activeTab === "params" && (
                  <div className="space-y-2 py-2">
                    <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mb-4">
                      Query Parameters
                    </p>
                    {[
                      ["stream", "false"],
                      ["version", "v2"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <input
                          defaultValue={k}
                          className="flex-1 bg-surface-container-low rounded px-3 py-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                          defaultValue={v}
                          className="flex-1 bg-surface-container-low rounded px-3 py-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Response Viewer ── */}
            {(response || loading) && (
              <div className="flex flex-col gap-4 fade-in">
                {/* Response meta */}
                {response && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold font-label px-2 py-0.5 rounded border ${
                            response.status < 300
                              ? "text-primary bg-primary/10 border-primary/20"
                              : "text-error bg-error/10 border-error/20"
                          }`}
                        >
                          {response.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {response.latency}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {response.size}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyResponse}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copied ? "check" : "content_copy"}
                        </span>
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">
                          download
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Response body */}
                <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 overflow-auto font-mono text-xs leading-relaxed">
                  {loading ? (
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Awaiting response…
                    </div>
                  ) : (
                    <pre className="text-on-surface-variant whitespace-pre-wrap">
                      {response?.body}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {!response && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-on-surface-variant/30">
                <span className="material-symbols-outlined text-6xl mb-4">
                  send
                </span>
                <p className="text-sm font-label uppercase tracking-widest">
                  Send a request to see the response
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
