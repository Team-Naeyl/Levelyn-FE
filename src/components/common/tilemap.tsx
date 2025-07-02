import { useMemo, useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import mockImage from '../../assets/mockimge.png';
import avatarImage from '../../assets/avatar.png';
import { Icon } from '@iconify/react';
import star from '@iconify-icons/material-symbols/star';

const MAP_WIDTH = 296;
const MAP_HEIGHT = 460;
const HEX_SIZE = 40;
export const MAX_HEXAGONS = 8;

export const CATEGORIES = {
  공부: { color: '#F0FFE4', name: '공부' },
  운동: { color: '#E0FFF5', name: '운동' },
  업무: { color: '#FFF3E0', name: '업무' },
  생활: { color: '#FFEBE9', name: '생활' },
  기타: { color: '#EAEEF2', name: '기타' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

interface Hexagon {
  id: string;
  q: number;
  r: number;
  x: number;
  y: number;
  step: number;
}

interface Todo {
  checked: boolean;
  category: CategoryKey;
}

interface TileMapProps {
  todos: Todo[];
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

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function TileMap({ todos }: TileMapProps) {
  const [mapSeed, setMapSeed] = useState(1);
  const [completedTodoOffset, setCompletedTodoOffset] = useState(0);
  const [taskCategories, setTaskCategories] = useState<{ [key: number]: CategoryKey }>({});

  const totalCompleted = useMemo(() => todos.filter((todo) => todo.checked).length, [todos]);
  const completedStep = totalCompleted - completedTodoOffset;
  const prevTodos = usePrevious(todos);

  useEffect(() => {
    if (!prevTodos) return;

    const newlyCheckedTodo = todos.find((todo, i) => todo.checked && !prevTodos[i]?.checked);

    if (newlyCheckedTodo) {
      const currentStepForNewTodo = totalCompleted - completedTodoOffset;
      setTaskCategories((prev) => ({
        ...prev,
        [currentStepForNewTodo]: newlyCheckedTodo.category,
      }));
    }
  }, [todos, prevTodos, totalCompleted, completedTodoOffset]);

  useEffect(() => {
    if (completedStep >= MAX_HEXAGONS) {
      const timer = setTimeout(() => {
        setMapSeed((prev) => prev + 1);
        setCompletedTodoOffset((prev) => prev + MAX_HEXAGONS);
        setTaskCategories({});
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [completedStep]);

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
                {isCompleted ? (
                  <image
                    href={mockImage}
                    x={-HEX_SIZE / 2}
                    y={-HEX_SIZE / 2}
                    width={HEX_SIZE}
                    height={HEX_SIZE}
                  />
                ) : isNext ? (
                  <image
                    href={avatarImage}
                    x={-HEX_SIZE / 2}
                    y={-HEX_SIZE / 2}
                    width={HEX_SIZE}
                    height={HEX_SIZE}
                  />
                ) : (
                  <Icon
                    icon={star}
                    x={-HEX_SIZE / 2 + 4}
                    y={-HEX_SIZE / 2 + 4}
                    width={HEX_SIZE - 8}
                    height={HEX_SIZE - 8}
                    color={'#e5e7eb'}
                  />
                )}
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
