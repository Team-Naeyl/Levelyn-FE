import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@emotion/react';

interface ChartData {
  name: string;
  value: number;
}

interface CustomBarChartProps {
  data: ChartData[];
}

export default function CustomBarChart({ data }: CustomBarChartProps) {
  const theme = useTheme();

  return (
    <ResponsiveContainer
      width="100%"
      height={120}
    >
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          width={0}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            background: theme.colors.white,
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: '4px',
            fontSize: '14px',
            padding: '8px',
          }}
          labelStyle={{ color: theme.colors.black, fontWeight: 'bold' }}
        />
        <Bar
          dataKey="value"
          fill={theme.colors.gray[900]}
          barSize={20}
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="value"
            position="top"
            fill={theme.colors.gray[700]}
            fontSize={12}
            formatter={(value: unknown) => (typeof value === 'number' && value > 0 ? value : '')}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
