import React from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-600 text-white">
        <p className="label font-bold text-cyan-400">{`Jogo em: ${label}`}</p>
        <p className="intro text-sm">{`Nota: ${payload[0].value}/10`}</p>
        <p className="text-xs text-gray-400">vs {payload[0].payload.opponent}</p>
      </div>
    );
  }

  return null;
};

export default function PerformanceChart({ data }) {
  const formattedData = data.map(item => ({
    ...item,
    game_date_formatted: format(new Date(item.game_date), 'dd MMM', { locale: ptBR }),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="game_date_formatted" 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <YAxis 
            stroke="#9ca3af"
            domain={[0, 10]}
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rating" name="Nota" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRating)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}