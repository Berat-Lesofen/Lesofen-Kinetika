/**
 * LESOFEN KINETIKA - Training Agenda Local Storage Manager
 * Sıfır backend, sadece yerel tarayıcı hafızası
 */

const STORAGE_KEY = 'lesofen_kinetika_agenda_v1';
const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export const SPLITS = [
  { id: "PUSH", name: "PUSH", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)", border: "#ea580c" },
  { id: "PULL", name: "PULL", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)", border: "#0891b2" },
  { id: "LEGS", name: "LEGS", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)", border: "#7c3aed" },
  { id: "UPPER", name: "UPPER", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "#0284c7" },
  { id: "LOWER", name: "LOWER", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)", border: "#9333ea" },
  { id: "FULL BODY", name: "FULL BODY", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "#059669" },
  { id: "ANTERIOR", name: "ANTERIOR", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)", border: "#ca8a04" },
  { id: "POSTERIOR", name: "POSTERIOR", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)", border: "#db2777" },
  { id: "REST", name: "REST", color: "#64748b", bg: "rgba(100, 116, 139, 0.15)", border: "#475569" }
];

const VALID_SPLIT_IDS = new Set(SPLITS.map(s => s.id));

function isValidDateKey(key) {
  return typeof key === 'string' && DATE_KEY_REGEX.test(key) && !FORBIDDEN_KEYS.has(key);
}

function isValidSplitId(id) {
  return typeof id === 'string' && VALID_SPLIT_IDS.has(id);
}

class AgendaStorage {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return Object.create(null);
      }
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return Object.create(null);

      const parsed = JSON.parse(stored);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return Object.create(null);
      }

      // Sanitize & validate entries against prototype pollution and invalid schemas
      const cleanData = Object.create(null);
      for (const [key, val] of Object.entries(parsed)) {
        if (isValidDateKey(key) && isValidSplitId(val)) {
          cleanData[key] = val;
        }
      }
      return cleanData;
    } catch (err) {
      console.warn("AgendaStorage load error:", err);
      return Object.create(null);
    }
  }

  save() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn("AgendaStorage save error:", err);
    }
  }

  getSplitForDate(dateKey) {
    if (!isValidDateKey(dateKey)) return null;
    return Object.prototype.hasOwnProperty.call(this.data, dateKey) ? this.data[dateKey] : null;
  }

  setSplitForDate(dateKey, splitId) {
    if (!isValidDateKey(dateKey)) return;

    if (!splitId) {
      delete this.data[dateKey];
    } else if (isValidSplitId(splitId)) {
      this.data[dateKey] = splitId;
    } else {
      console.warn("Invalid split ID:", splitId);
      return;
    }
    this.save();
  }

  removeSplit(dateKey) {
    if (!isValidDateKey(dateKey)) return;
    delete this.data[dateKey];
    this.save();
  }

  getAllData() {
    return { ...this.data };
  }
}

export const agendaStorage = new AgendaStorage();
