"use client";

import { useState, useMemo } from "react";
import {
  SLEDAI_GROUPS,
  calculateScore,
  getInterpretation,
  type SledaiItemKey,
} from "@/lib/sledai";

export default function Home() {
  const [checked, setChecked] = useState<Set<SledaiItemKey>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: SledaiItemKey) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const score = useMemo(() => calculateScore(checked), [checked]);
  const interpretation = useMemo(() => getInterpretation(score), [score]);

  const checkedItems = useMemo(
    () => SLEDAI_GROUPS.flatMap((g) => g.items.filter((i) => checked.has(i.key))),
    [checked]
  );

  const scorePercent = Math.min((score / 105) * 100, 100);

  const scoreBg =
    score === 0
      ? "bg-gray-400"
      : score <= 5
      ? "bg-green-500"
      : score <= 10
      ? "bg-yellow-400"
      : score <= 19
      ? "bg-orange-500"
      : "bg-red-600";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Calculadora SLEDAI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Índice de Actividad del Lupus Eritematoso Sistémico
              </p>
            </div>
          </div>

          {/* Score pill — visible on all viewports */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${interpretation.bgColor} ${interpretation.borderColor}`}
          >
            <span className={`text-2xl font-extrabold leading-none ${interpretation.color}`}>
              {score}
            </span>
            <span className={`text-xs font-semibold hidden sm:block ${interpretation.color}`}>
              {interpretation.label}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Checklist ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <svg
              className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              Marque los hallazgos presentes en las{" "}
              <strong>últimas 10 semanas</strong>. Los ítems deben atribuirse
              al LES activo, no a infección, fármacos u otras causas. Pulse{" "}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">
                ?
              </span>{" "}
              para ver la definición de cada ítem.
            </p>
          </div>

          {SLEDAI_GROUPS.map((group) => (
            <section
              key={group.id}
              className={`bg-white rounded-xl border-l-4 ${group.borderColor} shadow-sm overflow-hidden`}
            >
              {/* Group header */}
              <div className={`px-4 py-2.5 ${group.bgColor} flex items-center justify-between`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>
                  {group.label}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${group.borderColor} ${group.bgColor} ${group.color}`}
                >
                  {group.items[0].weight} {group.items[0].weight === 1 ? "pt" : "pts"} c/u
                </span>
              </div>

              {/* Items */}
              <ul className="divide-y divide-gray-100">
                {group.items.map((item) => {
                  const isChecked = checked.has(item.key);
                  const isExpanded = expanded.has(item.key);
                  return (
                    <li
                      key={item.key}
                      className={`transition-colors ${isChecked ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-start gap-3 px-4 py-3">
                        {/* Custom checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={() => toggle(item.key)}
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 hover:border-blue-400 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => toggle(item.key)}
                              className={`text-sm font-semibold text-left transition-colors ${
                                isChecked
                                  ? "text-blue-800"
                                  : "text-gray-800 hover:text-blue-700"
                              }`}
                            >
                              {item.label}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.key)}
                              className="shrink-0 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-xs font-bold flex items-center justify-center transition-colors leading-none"
                              aria-label="Ver definición"
                            >
                              ?
                            </button>
                          </div>
                          {isExpanded && (
                            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Weight badge */}
                        <span
                          className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                            isChecked
                              ? "bg-blue-600 text-white"
                              : `${group.bgColor} ${group.color}`
                          }`}
                        >
                          +{item.weight}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {/* Bottom spacer for mobile sticky bar */}
          <div className="h-20 lg:hidden" />
        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Score card */}
            <div
              className={`bg-white rounded-xl shadow-sm border ${interpretation.borderColor} overflow-hidden`}
            >
              <div className={`px-5 py-5 ${interpretation.bgColor}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Puntuación SLEDAI
                </p>
                <div className="flex items-end gap-2">
                  <span
                    className={`text-7xl font-black leading-none ${interpretation.color}`}
                  >
                    {score}
                  </span>
                  <span className="text-sm text-gray-400 mb-2">/ 105</span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBg}`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
              <div className={`px-5 py-3 border-t border-gray-100 flex items-center gap-2`}>
                <span className={`w-2.5 h-2.5 rounded-full ${scoreBg}`} />
                <span className={`text-sm font-semibold ${interpretation.color}`}>
                  {interpretation.label}
                </span>
              </div>
            </div>

            {/* Scale reference */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                Escala de referencia
              </p>
              <ul className="space-y-2">
                {[
                  { range: "0", label: "Sin actividad", dot: "bg-gray-400", text: "text-gray-600" },
                  { range: "1 – 5", label: "Actividad leve", dot: "bg-green-500", text: "text-green-700" },
                  { range: "6 – 10", label: "Actividad moderada", dot: "bg-yellow-400", text: "text-yellow-700" },
                  { range: "11 – 19", label: "Actividad alta", dot: "bg-orange-500", text: "text-orange-700" },
                  { range: "≥ 20", label: "Actividad muy alta", dot: "bg-red-600", text: "text-red-700" },
                ].map((r) => (
                  <li key={r.range} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${r.dot}`} />
                    <span className="text-xs font-mono text-gray-400 w-14 shrink-0">
                      {r.range}
                    </span>
                    <span className={`text-xs font-medium ${r.text}`}>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Checked items */}
            {checkedItems.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  Ítems marcados ({checkedItems.length})
                </p>
                <ul className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {checkedItems.map((item) => (
                    <li key={item.key} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-700 truncate">{item.label}</span>
                      <span className="shrink-0 text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        +{item.weight}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Total</span>
                  <span className="text-sm font-extrabold text-blue-700">{score} pts</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400">
                  Ningún ítem seleccionado aún.
                </p>
              </div>
            )}

            {/* Reset button */}
            <button
              type="button"
              onClick={() => {
                setChecked(new Set());
                setExpanded(new Set());
              }}
              disabled={checked.size === 0}
              className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reiniciar calculadora
            </button>
          </div>
        </aside>
      </div>

      {/* ─── Mobile sticky bottom bar ──────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div
            className={`flex-1 rounded-xl border px-4 py-2 ${interpretation.bgColor} ${interpretation.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Puntuación SLEDAI</p>
                <p className={`text-3xl font-black leading-tight ${interpretation.color}`}>
                  {score}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${interpretation.color}`}>
                  {interpretation.label}
                </p>
                {checkedItems.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {checkedItems.length} ítem{checkedItems.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setChecked(new Set());
              setExpanded(new Set());
            }}
            disabled={checked.size === 0}
            className="shrink-0 py-2 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="hidden lg:block text-center py-6 text-xs text-gray-400">
        SLEDAI · Systemic Lupus Erythematosus Disease Activity Index · Solo uso clínico de referencia
      </footer>
    </div>
  );
}
