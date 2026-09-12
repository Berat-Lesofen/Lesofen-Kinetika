/**
 * LESOFEN KINETIKA - Training Agenda Local Storage Manager
 * Sıfır backend, sadece yerel tarayıcı hafızası
 */

const STORAGE_KEY = 'lesofen_kinetika_agenda_v1';

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

class AgendaStorage {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.warn("AgendaStorage load error:", err);
      return {};
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn("AgendaStorage save error:", err);
    }
  }

  getSplitForDate(dateKey) {
    return this.data[dateKey] || null;
  }

  setSplitForDate(dateKey, splitId) {
    if (!splitId) {
      delete this.data[dateKey];
    } else {
      this.data[dateKey] = splitId;
    }
    this.save();
  }

  removeSplit(dateKey) {
    delete this.data[dateKey];
    this.save();
  }

  getAllData() {
    return { ...this.data };
  }
}

export const agendaStorage = new AgendaStorage();
