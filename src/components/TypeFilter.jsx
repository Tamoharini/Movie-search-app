import "./TypeFilter.css";

/** Options map: display label → API value */
const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "🎬 Movies", value: "movie" },
  { label: "📺 Series", value: "series" },
  { label: "🎞 Episodes", value: "episode" },
];

export default function TypeFilter({ value, onChange }) {
  return (
    <div className="typefilter">
      <label htmlFor="type-select" className="typefilter__label">
        Filter by type:
      </label>

      <select
        id="type-select"
        className="typefilter__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter movies by type"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}