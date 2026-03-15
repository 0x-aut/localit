type SparklineProps = {
  data: number[] // array of coverage % values e.g. [87, 90, 85, 92, 94, 89, 95, 97, 94, 98]
  width?: number
  height?: number
}

export function Sparkline({ data, width = 80, height = 24 }: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y }
  })

  const linePoints = points.map(p => `${p.x},${p.y}`).join(' ')
  
  // polygon closes the shape down to the bottom corners for the fill
  const fillPoints = [
    `0,${height}`,
    ...points.map(p => `${p.x},${p.y}`),
    `${width},${height}`
  ].join(' ')

  const trending = data[data.length - 1] >= data[0]
  const color = trending ? '#22C55E' : '#EF4444'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`fade-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#fade-${color})`}
      />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type RunSparklineProps = {
  data: (number | null)[];
  height?: number;
  totalPoints?: number;
};

export function RunSparkline({
  data,
  height = 20,
  totalPoints = 10,
}: RunSparklineProps) {
  // Pad from the left with nulls to always have totalPoints slots
  const padded: (number | null)[] = [
    ...data.slice(-totalPoints),
    ...Array(Math.max(0, totalPoints - data.length)).fill(null),
  ];

  // Only draw lines between consecutive non-null points
  const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];

  const realPoints = padded
    .map((val, i) => (val !== null ? { x: i, y: val } : null));

  // Find min/max from real values only
  const realValues = data.filter((v): v is number => v !== null);
  const min = realValues.length > 0 ? Math.min(...realValues) : 0;
  const max = realValues.length > 0 ? Math.max(...realValues) : 100;
  const range = max - min || 1;

  const toCoord = (i: number, val: number) => ({
    x: (i / (totalPoints - 1)) * 100,
    y: height - ((val - min) / range) * (height - 2) - 1,
  });

  // Build line segments — only between consecutive non-null points
  for (let i = 0; i < realPoints.length - 1; i++) {
    const curr = realPoints[i];
    const next = realPoints[i + 1];
    if (curr && next) {
      const c = toCoord(i, curr.y);
      const n = toCoord(i + 1, next.y);
      segments.push({ x1: c.x, y1: c.y, x2: n.x, y2: n.y });
    }
  }

  // Fill polygon — only under real points
  const realCoords = realPoints
    .filter((p): p is { x: number; y: number } => p !== null)
    .map((p) => toCoord(p.x, p.y));

  const trending =
    realValues.length >= 2
      ? realValues[realValues.length - 1] >= realValues[0]
      : true;
  const color = trending ? "#22C55E" : "#EF4444";

  const fillPoints =
    realCoords.length >= 2
      ? [
          `${realCoords[0].x},${height}`,
          ...realCoords.map((p) => `${p.x},${p.y}`),
          `${realCoords[realCoords.length - 1].x},${height}`,
        ].join(" ")
      : "";

  const gradientId = `run-sparkline-fade-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      height={height}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Faded fill under the line */}
      {fillPoints && (
        <polygon points={fillPoints} fill={`url(#${gradientId})`} />
      )}

      {/* Line segments — gaps where null points are */}
      {segments.map((seg, i) => (
        <line
          key={i}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Dot on the last real point */}
      {realCoords.length > 0 && (
        <circle
          cx={realCoords[realCoords.length - 1].x}
          cy={realCoords[realCoords.length - 1].y}
          r="1.5"
          fill={color}
        />
      )}
    </svg>
  );
}