import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { ResponsiveBar } from '@nivo/bar';
import CollapsibleSidebar from '../components/CollapsibleSidebar';

interface RootCauseEntry {
  id: string;
  metric: string;
  cause: string;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

const rootCauseOptions = [
  {
    id: "rootCauseEngine",
    title: "🔎 Root Cause Engine",
    desc: "AI-powered root cause analysis",
    icon: "🔎"
  },
  {
    id: "clusterVisualization",
    title: "📊 Cluster Visualization",
    desc: "Visual clustering of anomalies",
    icon: "📊"
  },
  {
    id: "confidenceScoring",
    title: "📈 Confidence Scoring",
    desc: "Root cause confidence levels",
    icon: "📈"
  }
];

const RootCause: React.FC = () => {
  const [selectedView, setSelectedView] = useState('rootCauseEngine');
  const navigate = useNavigate();

  const rootCauses = useMemo(() => {
    const mockCauses: RootCauseEntry[] = [
      {
        id: '1',
        metric: 'Temperature',
        cause: 'Cooling system malfunction',
        confidence: 85,
        severity: 'High',
        timestamp: '2024-03-10 14:30'
      },
      {
        id: '2',
        metric: 'Vibration',
        cause: 'Bearing wear',
        confidence: 75,
        severity: 'Medium',
        timestamp: '2024-03-10 15:45'
      },
      {
        id: '3',
        metric: 'Pressure',
        cause: 'Valve blockage',
        confidence: 90,
        severity: 'High',
        timestamp: '2024-03-10 16:15'
      }
    ];
    return mockCauses;
  }, []);

  const renderContent = () => {
    switch (selectedView) {
      case 'rootCauseEngine':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Root Cause Analysis Results</h2>
            <div className="grid gap-4">
              {rootCauses.map(cause => (
                <div
                  key={cause.id}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{cause.metric}</h3>
                      <p className="text-gray-600">{cause.cause}</p>
                    </div>
                    <span className={`px-2 py-1 rounded ${
                      cause.severity === 'High' ? 'bg-red-100 text-red-800' :
                      cause.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {cause.severity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{cause.timestamp}</span>
                      <span className="text-purple-600">Confidence: {cause.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'clusterVisualization':
        const scatterData = [
          {
            id: 'Temperature',
            data: rootCauses
              .filter(cause => cause.metric === 'Temperature')
              .map(cause => ({
                x: new Date(cause.timestamp).getTime(),
                y: cause.confidence,
                severity: cause.severity
              }))
          },
          {
            id: 'Vibration',
            data: rootCauses
              .filter(cause => cause.metric === 'Vibration')
              .map(cause => ({
                x: new Date(cause.timestamp).getTime(),
                y: cause.confidence,
                severity: cause.severity
              }))
          },
          {
            id: 'Pressure',
            data: rootCauses
              .filter(cause => cause.metric === 'Pressure')
              .map(cause => ({
                x: new Date(cause.timestamp).getTime(),
                y: cause.confidence,
                severity: cause.severity
              }))
          }
        ];

        return (
          <div className="h-[500px]">
            <ResponsiveScatterPlot
              data={scatterData}
              margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
              xScale={{
                type: 'time',
                format: 'native',
                precision: 'minute'
              }}
              yScale={{
                type: 'linear',
                min: 0,
                max: 100
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                format: '%H:%M',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Time',
                legendOffset: 60,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Confidence Score',
                legendOffset: -60,
                legendPosition: 'middle'
              }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 130,
                  translateY: 0,
                  itemWidth: 100,
                  itemHeight: 12,
                  itemsSpacing: 5,
                  itemDirection: 'left-to-right',
                  symbolSize: 12,
                  symbolShape: 'circle'
                }
              ]}
            />
          </div>
        );

      case 'confidenceScoring':
        const confidenceData = rootCauses.map(cause => ({
          cause: cause.cause,
          confidence: cause.confidence,
          color: cause.severity === 'High' ? '#ef4444' : 
                 cause.severity === 'Medium' ? '#f59e0b' : '#10b981'
        }));

        return (
          <div className="h-[500px]">
            <ResponsiveBar
              data={confidenceData}
              keys={['confidence']}
              indexBy="cause"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={{ scheme: 'purple_red' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Root Cause',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Confidence Score',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20
                }
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CollapsibleSidebar
        options={rootCauseOptions}
        selectedOption={selectedView}
        onOptionSelect={setSelectedView}
      />
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {rootCauseOptions.find(opt => opt.id === selectedView)?.title || 'Root Cause Analysis'}
            </h1>
            <button
              onClick={() => navigate('/forecast')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Back to Forecast
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RootCause; 