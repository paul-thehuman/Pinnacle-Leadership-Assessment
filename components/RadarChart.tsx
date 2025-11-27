import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Dimension } from '../types';

interface Props {
  scores: Record<Dimension, number>;
}

export const AssessmentRadarChart: React.FC<Props> = ({ scores }) => {
  const data = Object.entries(scores).map(([key, value]) => ({
    subject: key,
    A: value,
    fullMark: 5,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            name="Leadership Profile"
            dataKey="A"
            stroke="#4f46e5"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};