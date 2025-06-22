import { useState, useMemo } from 'react';
import styled from '@emotion/styled';

const MAP_WIDTH = 360;
const MAP_HEIGHT = 480;
const HEX_SIZE = 60;

const MAX_HEXAGONS = 8;

const CATEGORIES = {
  공부: { color: '#bfdbfe', name: '공부' },
  운동: { color: '#bbf7d0', name: '운동' },
  업무: { color: '#fef08a', name: '업무' },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

interface Hexagon {
  id: string;
  q: number;
  r: number;
  x: number;
  y: number;
  step: number;
}

const seededRandom = (seed: number, min = 0, max = 1): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
};

const createHexagonPath = (size: number): string => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')} Z`;
};

const getNeighborPositions = (q: number, r: number): [number, number][] => {
  const directions = [
    [+1, 0],
    [+1, -1],
    [0, -1],
    [-1, 0],
    [-1, +1],
    [0, +1],
  ];
  return directions.map(([dq, dr]) => [q + dq, r + dr]);
};

const axialToPixel = (q: number, r: number, size: number): [number, number] => {
  const x = size * ((3 / 2) * q);
  const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return [x, y];
};

export default function TileMap() {
  const [mapSeed, setMapSeed] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [taskCategories, setTaskCategories] = useState<{ [key: number]: CategoryKey }>({});

  const hexagonCluster = useMemo((): Hexagon[] => {
    let currentSeed = mapSeed;
    const hexagons: Hexagon[] = [];
    const usedPositions = new Set<string>();

    const startQ = 0,
      startR = 0;
    const [startX, startY] = axialToPixel(startQ, startR, HEX_SIZE);

    const startHex: Hexagon = {
      id: `hex_${startQ}_${startR}`,
      q: startQ,
      r: startR,
      x: startX + MAP_WIDTH / 2,
      y: startY + MAP_HEIGHT / 2,
      step: 1,
    };

    hexagons.push(startHex);
    usedPositions.add(`${startQ},${startR}`);

    let lastHex = startHex;

    while (hexagons.length < MAX_HEXAGONS) {
      const neighbors = getNeighborPositions(lastHex.q, lastHex.r);
      const candidatePositions = neighbors
        .map(([q, r]) => ({ q, r, key: `${q},${r}` }))
        .filter((pos) => !usedPositions.has(pos.key));

      if (candidatePositions.length === 0) break;

      const randomIndex = Math.floor(seededRandom(currentSeed++, 0, candidatePositions.length));
      const { q, r, key } = candidatePositions[randomIndex];

      const [pixelX, pixelY] = axialToPixel(q, r, HEX_SIZE);
      const newHex: Hexagon = {
        id: `hex_${q}_${r}`,
        q,
        r,
        x: pixelX + MAP_WIDTH / 2,
        y: pixelY + MAP_HEIGHT / 2,
        step: hexagons.length + 1,
      };

      hexagons.push(newHex);
      usedPositions.add(key);
      lastHex = newHex;
    }
    return hexagons;
  }, [mapSeed]);

  const viewBox = useMemo(() => {
    if (hexagonCluster.length === 0) return `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    hexagonCluster.forEach((hex) => {
      minX = Math.min(minX, hex.x - HEX_SIZE);
      maxX = Math.max(maxX, hex.x + HEX_SIZE);
      minY = Math.min(minY, hex.y - HEX_SIZE);
      maxY = Math.max(maxY, hex.y + HEX_SIZE);
    });

    const padding = HEX_SIZE * 0.5;
    return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
  }, [hexagonCluster]);

  return (
    <Container>
      <MapContainer>
        <svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={viewBox}
        >
          {hexagonCluster.map((hex) => {
            const isCompleted = hex.step <= completedStep;
            const isNext = hex.step === completedStep + 1;
            const categoryKey = taskCategories[hex.step];

            const fill = isCompleted && categoryKey ? CATEGORIES[categoryKey].color : 'white';
            const stroke = isCompleted || isNext ? 'black' : '#e5e7eb';
            const textColor = isCompleted || isNext ? 'black' : '#e5e7eb';

            return (
              <g
                key={hex.id}
                transform={`translate(${hex.x}, ${hex.y})`}
              >
                <HexagonPath
                  d={createHexagonPath(HEX_SIZE - 2)}
                  fill={fill}
                  stroke={stroke}
                />
                <HexagonText
                  x="0"
                  y="6"
                  textColor={textColor}
                >
                  {hex.step}
                </HexagonText>
              </g>
            );
          })}
        </svg>
      </MapContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const HexagonPath = styled.path<{ fill: string; stroke: string }>`
  fill: ${(props) => props.fill};
  stroke: ${(props) => props.stroke};
  stroke-width: 2px;
  transition: all 0.3s ease-in-out;
`;

const HexagonText = styled.text<{ textColor: string }>`
  font-weight: 700;
  font-size: 20px;
  fill: ${(props) => props.textColor};
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
  transition: fill 0.3s ease-in-out;
`;
