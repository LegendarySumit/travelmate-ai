/**
 * Decorative SVG Components for TravelMate AI
 */

export const DottedFlightPath = ({ className = "" }) => (
  <svg
    className={`overflow-visible ${className}`}
    width="220"
    height="90"
    viewBox="0 0 220 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Curved Dotted Path */}
    <path
      d="M10 75 C 60 75, 90 15, 160 25 C 185 28, 205 15, 212 5"
      stroke="#064E3B"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Airplane Icon at the tip */}
    <g transform="translate(202, -2) rotate(35)">
      <path
        d="M12 0L4.5 14L8.5 12L12 16L15.5 12L19.5 14L12 0Z"
        fill="#064E3B"
      />
    </g>
  </svg>
);

export const CloudIllustration = ({ className = "w-16 h-10", color = "#E2E8F0" }) => (
  <svg
    className={className}
    viewBox="0 0 64 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 24H16C10.4772 24 6 19.5228 6 14C6 8.52285 10.4772 4 16 4C18.1509 4 20.1448 4.67156 21.8213 5.82346C24.3828 2.47703 28.4011 0.333333 32.8889 0.333333C39.4678 0.333333 45.0392 5.06813 46.4258 11.3159C48.6186 10.8711 50.9329 11.1396 52.9238 12.1852C57.3486 14.5165 59.5898 19.6025 58.2618 24.3228C57.8184 25.9085 56.5599 27.167 54.9742 27.6104C53.308 28.0822 51.5835 28.0336 50 27.4875V24Z"
      fill={color}
      fillOpacity="0.85"
    />
  </svg>
);

export const AirplaneIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
      fill={color}
    />
  </svg>
);
