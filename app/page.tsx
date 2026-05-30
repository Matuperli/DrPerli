"use client";

import { useState } from "react";
import {
  SLEDAI_GROUPS,
  calculateScore,
  getInterpretation,
  type SledaiItemKey,
} from "@/lib/sledai";

export default function Home() {
  const [checked, setChecked] = useState<Set<SledaiItemKey>>(new Set());

  const toggle = (key: SledaiItemKey) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const score = calculateScore(checked);
  const interpretation = getInterpretation(score);

  const checkedItems = SLEDAI_GROUPS.flatMap((g) =>
    g.items.filter((i) => checked.has(i.key))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Calculadora SLEDAI</h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Systemic Lupus Erythematosus Disease Activity Index
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${interpretation.bgColor} ${interpretation.borderColor} ${interpretation.color}`}
            >
              <span className="text-2xl font-bold">{score}</span>
              <span className="hidden sm:inline">{interpretation.label}</span>
            </div>
            <button
              onClick={() => setChecked(new Set())}
              className="text-xs px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          {SLEDAI_GROUPS.map((group) => (
            <div
              key={group.id}
              className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm`}
            >
              <div className={`px-4 py-3 border-l-4 ${group.borderColor} ${group.bgColor}`}>
                <h2 className={`font-semibold text-sm uppercase tracking-wide ${group.color}`}>
                  {group.label}
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => {
                  const isChecked = checked.has(item.key);
                  return (
                    <label
                      key={item.key}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        isChecked ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item.key)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isChecked ? "text-blue-700" : "text-slate-700"}`}>
                            {item.label}
                          </span>
                          <span
                            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                              isChecked
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            +{item.weight}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar result */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-sm text-slate-700">Resultado</h2>
            </div>
            <div className="p-4 text-center">
              <div
                className={`inline-flex flex-col items-center px-6 py-4 rounded-xl border-2 ${interpretation.bgColor} ${interpretation.borderColor} w-full`}
              >
                <span className={`text-6xl font-extrabold ${interpretation.color}`}>{score}</span>
                <span className={`text-sm font-semibold mt-1 ${interpretation.color}`}>
                  {interpretation.label}
                </span>
              </div>
            </div>

            {/* Scale reference */}
            <div className="px-4 pb-4 space-y-1">
              <p className="text-xs font-medium text-slate-500 mb-2">Escala de referencia</p>
              {[
                { range: "0", label: "Sin actividad", color: "bg-gray-400" },
                { range: "1 – 5", label: "Actividad leve", color: "bg-green-500" },
                { range: "6 – 10", label: "Moderada", color: "bg-yellow-500" },
                { range: "11 – 19", label: "Alta", color: "bg-orange-500" },
                { range: "≥ 20", label: "Muy alta", color: "bg-red-500" },
              ].map((r) => (
                <div key={r.range} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${r.color}`} />
                  <span className="text-xs text-slate-500 w-12 shrink-0">{r.range}</span>
                  <span className="text-xs text-slate-600">{r.label}</span>
                </div>
              ))}
            </div>

            {/* Checked items list */}
            {checkedItems.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Ítems seleccionados ({checkedItems.length})
                </p>
                <ul className="space-y-1">
                  {checkedItems.map((item) => (
                    <li key={item.key} className="flex justify-between text-xs">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-blue-600">+{item.weight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Total</span>
                  <span className="text-blue-700">{score}</span>
                </div>
              </div>
            )}

            {checkedItems.length === 0 && (
              <div className="px-4 pb-4 text-center">
                <p className="text-xs text-slate-400">
                  Seleccioná los hallazgos presentes en las últimas 10 días.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-slate-400">
        SLEDAI — Systemic Lupus Erythematosus Disease Activity Index · Solo uso clínico de referencia
      </footer>
    </div>
  );
}
