/**
 * BIOMECHANICS MODEL LAB — SHARED CONSTANTS
 * Physical constants, anthropometric standards (Winter 2009, Dempster 1955),
 * and scientific visualization theme colors.
 */

export const PHYSICS = {
  GRAVITY: 9.80665, // Standard gravitational acceleration in m/s^2
};

/**
 * Anthropometric segment proportions relative to body height (H) and body mass (M)
 * Reference: Winter, D. A. (2009). Biomechanics and Motor Control of Human Movement (4th ed.).
 */
export const ANTHROPOMETRY = {
  DEFAULT_HEIGHT: 1.75, // meters
  DEFAULT_MASS: 75.0,    // kg

  // Segment Length / Height Ratios
  RATIOS: {
    HUMERUS: 0.172,       // ~0.30 m for 1.75m height
    FOREARM: 0.157,       // ~0.275 m
    HAND_GRIP: 0.075,     // center of grip distance ~0.075 m
    TOTAL_ARM: 0.404,     // ~0.65 - 0.70 m
    FEMUR: 0.245,         // ~0.43 m
    TIBIA: 0.246,         // ~0.43 m
    FOOT_LENGTH: 0.152,   // ~0.26 m
    TRUNK: 0.288,         // ~0.50 m
  },

  // Segment Mass / Total Body Mass Ratios
  MASS_FRACTIONS: {
    UPPER_ARM: 0.028,     // 2.8% of body mass
    FOREARM_HAND: 0.022,  // 2.2% of body mass
    THIGH: 0.100,         // 10.0% of body mass
    SHANK_FOOT: 0.061,    // 6.1% of body mass
    TRUNK_HEAD_NECK: 0.678 // 67.8% of body mass
  },

  // Segment Center of Mass (COM) locations from proximal joint
  COM_PROXIMAL_RATIOS: {
    UPPER_ARM: 0.436,     // 43.6% from glenohumeral joint
    FOREARM: 0.430,       // 43.0% from elbow joint
    THIGH: 0.433,         // 43.3% from hip joint
    SHANK: 0.433,         // 43.3% from knee joint
  }
};

/**
 * Standard visual styling for biomechanical illustrations.
 */
export const COLORS = {
  BACKGROUND: '#090d16',
  PANEL_BG: '#111827',
  BORDER: '#1f2937',
  GRID: '#1e293b',

  // Anatomy
  BONE: '#e2e8f0',
  BONE_OUTLINE: '#94a3b8',
  JOINT_CENTER: '#38bdf8',
  JOINT_OUTLINE: '#0284c7',
  SCAPULA: '#64748b',

  // Muscles & Tendons
  MUSCLE_RELAXED: '#dc2626',
  MUSCLE_ACTIVE: '#ef4444',
  MUSCLE_TENSION_HEAT: '#f87171',
  TENDON: '#f1f5f9',

  // Mechanics & Vectors
  EXTERNAL_FORCE: '#fbbf24',    // Gold / Amber (Dumbbell gravity, Barbell gravity)
  MUSCLE_FORCE: '#f43f5e',      // Rose / Red (Deltoid, Biceps tension line)
  EXTERNAL_MOMENT_ARM: '#3b82f6', // Bright Blue (r_ext perpendicular projection)
  INTERNAL_MOMENT_ARM: '#10b981', // Emerald Green (r_int perpendicular projection)
  ANGLE_ARC: '#a855f7',         // Purple
  REFERENCE_LINE: '#475569',    // Slate dashed line
  TEXT: '#f8fafc',
  TEXT_MUTED: '#94a3b8'
};
