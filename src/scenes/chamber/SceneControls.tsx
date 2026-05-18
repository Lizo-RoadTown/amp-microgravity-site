import type { MechanismFlags, SceneControls as Controls } from "./types";

interface Props {
  value: Controls;
  onChange: (next: Controls) => void;
}

const MECHANISM_LABELS: Array<{ key: keyof MechanismFlags; label: string; gScaled: boolean }> = [
  { key: "sedimentation", label: "Sedimentation", gScaled: true },
  { key: "convection", label: "Buoyant convection", gScaled: true },
  { key: "diffusion", label: "Brownian diffusion", gScaled: false },
  { key: "swimming", label: "Flagellar swimming", gScaled: false },
];

export function SceneControls({ value, onChange }: Props) {
  const setGravity = (g: number) => onChange({ ...value, gravity: g });
  const toggleMech = (key: keyof MechanismFlags) =>
    onChange({
      ...value,
      mechanisms: { ...value.mechanisms, [key]: !value.mechanisms[key] },
    });

  return (
    <div className="scene-controls">
      <div className="scene-controls__row">
        <label className="scene-controls__slider">
          <span className="scene-controls__label">
            Gravity <strong>{value.gravity.toFixed(2)} g</strong>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value.gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
          />
          <span className="scene-controls__legend">
            <span>µg</span><span>1g</span>
          </span>
        </label>
      </div>
      <div className="scene-controls__row scene-controls__row--toggles">
        {MECHANISM_LABELS.map(({ key, label, gScaled }) => (
          <label key={key} className="scene-controls__toggle">
            <input
              type="checkbox"
              checked={value.mechanisms[key]}
              onChange={() => toggleMech(key)}
            />
            <span>{label}</span>
            {gScaled && <span className="scene-controls__tag">scales with g</span>}
          </label>
        ))}
      </div>
    </div>
  );
}
