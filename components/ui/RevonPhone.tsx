/**
 * An illustration of the Revon ride screen, drawn in SVG so it stays sharp at
 * any size and loads no remote asset. Rider names are made up. The colours are
 * the app's own (ink, one lime accent) and deliberately do not follow the site
 * theme: the phone always shows the app's dark mode.
 */
const LIME = "#c8f135";
const INK = "#0a0a0a";
const SANS = "system-ui, sans-serif";

const riders = [
  { x: 150, y: 172, name: "Aarav", tag: null, you: false },
  { x: 118, y: 232, name: "Maya", tag: "Fuel stop", you: false },
  { x: 96, y: 296, name: "You", tag: null, you: true },
  { x: 74, y: 352, name: "Kabir", tag: null, you: false },
];

const chips = ["Fuel", "Rest", "Food", "Mechanic"];

export default function RevonPhone({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 560"
      role="img"
      aria-label="Illustration of the Revon ride screen: four riders on a live map with a route, a speed readout, an SOS button and a ride panel"
      className={className}
    >
      <defs>
        <clipPath id="revon-screen">
          <rect x="12" y="12" width="256" height="536" rx="34" />
        </clipPath>
      </defs>

      {/* Bezel */}
      <rect
        x="2"
        y="2"
        width="276"
        height="556"
        rx="42"
        fill="#1c1c1a"
        stroke={LIME}
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <rect x="12" y="12" width="256" height="536" rx="34" fill="#0f0f0e" />

      <g clipPath="url(#revon-screen)">
        {/* Map streets */}
        <g stroke="#262624" strokeWidth="9" strokeLinecap="round" fill="none">
          <path d="M-10 120 L300 150" />
          <path d="M-10 250 L300 215" />
          <path d="M-10 410 L300 380" />
          <path d="M60 40 L110 560" />
          <path d="M200 40 L170 560" />
        </g>
        <g stroke="#1c1c1a" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M-10 190 L300 185" />
          <path d="M-10 320 L300 300" />
          <path d="M130 40 L140 560" />
        </g>
        <path
          d="M214 60 q30 40 22 90 t-14 100 q-6 40 -42 52 l-44 12 z"
          fill="#14181a"
          opacity="0.7"
        />

        {/* Route: travelled part grey, the rest in the accent */}
        <path
          d="M74 352 C78 330 90 318 96 296 C104 268 112 252 118 232"
          stroke="#6b6b62"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M118 232 C128 206 142 190 150 172 C164 140 190 120 214 96"
          stroke={LIME}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Destination */}
        <circle cx="214" cy="96" r="12" fill={LIME} fillOpacity="0.25" />
        <circle cx="214" cy="96" r="6" fill={LIME} stroke={INK} strokeWidth="2" />

        {/* Riders */}
        {riders.map((r) => (
          <g key={r.name}>
            <circle
              cx={r.x}
              cy={r.y}
              r={r.you ? 13 : 11}
              fill={r.you ? LIME : "#f5f5f0"}
              stroke={INK}
              strokeWidth="3"
            />
            <text
              x={r.x}
              y={r.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={INK}
              fontFamily={SANS}
            >
              {r.name[0]}
            </text>
            <g transform={`translate(${r.x + 18} ${r.y - 9})`}>
              <rect
                width={r.name.length * 6.2 + 14}
                height="18"
                rx="9"
                fill={INK}
                fillOpacity="0.88"
              />
              <text x="9" y="12.5" fontSize="9.5" fontWeight="600" fill="#f5f5f0" fontFamily={SANS}>
                {r.name}
              </text>
            </g>
            {r.tag && (
              <g transform={`translate(${r.x + 18} ${r.y + 12})`}>
                <rect width="56" height="16" rx="8" fill={LIME} />
                <text
                  x="28"
                  y="11.5"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="700"
                  fill={INK}
                  fontFamily={SANS}
                >
                  {r.tag}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Search pill */}
        <rect
          x="28"
          y="34"
          width="224"
          height="38"
          rx="19"
          fill="#161615"
          stroke="#ffffff"
          strokeOpacity="0.1"
        />
        <circle cx="50" cy="53" r="6" stroke="#a8a8a0" strokeWidth="1.6" fill="none" />
        <path d="M54.5 57.5 L59 62" stroke="#a8a8a0" strokeWidth="1.6" strokeLinecap="round" />
        <text x="70" y="57" fontSize="12" fill="#a8a8a0" fontFamily={SANS}>
          Where to?
        </text>

        {/* Speed pill and SOS */}
        <rect
          x="28"
          y="394"
          width="74"
          height="30"
          rx="15"
          fill={INK}
          fillOpacity="0.9"
          stroke="#ffffff"
          strokeOpacity="0.12"
        />
        <text
          x="65"
          y="413"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#f5f5f0"
          fontFamily={SANS}
        >
          62 km/h
        </text>
        <rect x="204" y="394" width="48" height="30" rx="15" fill="#e5342b" />
        <text
          x="228"
          y="413"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#ffffff"
          fontFamily={SANS}
        >
          SOS
        </text>

        {/* Ride panel */}
        <rect
          x="12"
          y="436"
          width="256"
          height="112"
          rx="26"
          fill="#121211"
          stroke="#ffffff"
          strokeOpacity="0.1"
        />
        <rect x="124" y="444" width="32" height="4" rx="2" fill="#ffffff" fillOpacity="0.25" />
        <text x="30" y="474" fontSize="13" fontWeight="700" fill="#f5f5f0" fontFamily={SANS}>
          4 riders
        </text>
        <text x="30" y="491" fontSize="10.5" fill="#a8a8a0" fontFamily={SANS}>
          Group stretched 1.4 km
        </text>
        {chips.map((c, i) => (
          <g key={c} transform={`translate(${30 + i * 56} 505)`}>
            <rect
              width={c === "Mechanic" ? 62 : 50}
              height="22"
              rx="11"
              fill="#1c1c1a"
              stroke="#ffffff"
              strokeOpacity="0.1"
            />
            <text
              x={c === "Mechanic" ? 31 : 25}
              y="15"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="600"
              fill="#f5f5f0"
              fontFamily={SANS}
            >
              {c}
            </text>
          </g>
        ))}
      </g>

      {/* Camera notch */}
      <rect x="112" y="20" width="56" height="14" rx="7" fill="#050505" />
    </svg>
  );
}
