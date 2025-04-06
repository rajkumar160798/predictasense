import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import CollapsibleSidebar from '../components/CollapsibleSidebar';

interface Action {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  impact: number;
  status: 'Open' | 'In Progress' | 'Resolved';
  metric: string;
}

const actionOptions = [
  {
    id: "priorityActions",
    title: "🚨 Priority Actions",
    desc: "High-priority maintenance tasks",
    icon: "🚨"
  },
  {
    id: "alertPriority",
    title: "📊 Alert Prioritization",
    desc: "Ranked list of alerts by severity",
    icon: "📊"
  },
  {
    id: "impactForecast",
    title: "📈 Impact Forecast",
    desc: "Predicted impact of anomalies",
    icon: "📈"
  },
  {
    id: "comments",
    title: "💬 Team Comments",
    desc: "Collaboration and notes",
    icon: "💬"
  }
];

const SuggestedActions: React.FC = () => {
  const [selectedView, setSelectedView] = useState('priorityActions');
  const navigate = useNavigate();

  const actions = useMemo(() => {
    const mockActions: Action[] = [
      {
        id: '1',
        title: 'High Temperature Alert',
        description: 'Temperature exceeded threshold. Check cooling system.',
        severity: 'High',
        impact: 85,
        status: 'Open',
        metric: 'Temperature'
      },
      {
        id: '2',
        title: 'Vibration Warning',
        description: 'Abnormal vibration detected. Inspect bearings.',
        severity: 'Medium',
        impact: 65,
        status: 'In Progress',
        metric: 'Vibration'
      },
      {
        id: '3',
        title: 'Pressure Anomaly',
        description: 'Pressure spike detected. Check valves.',
        severity: 'High',
        impact: 75,
        status: 'Open',
        metric: 'Pressure'
      }
    ];
    return mockActions;
  }, []);

  const renderContent = () => {
    switch (selectedView) {
      case 'priorityActions':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">High Priority Actions</h2>
            <div className="grid gap-4">
              {actions
                .filter(action => action.severity === 'High')
                .map(action => (
                  <div
                    key={action.id}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500"
                  >
                    <h3 className="font-bold text-lg">{action.title}</h3>
                    <p className="text-gray-600">{action.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-red-500">Impact: {action.impact}%</span>
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                        {action.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'alertPriority':
        const priorityData = actions.map(action => ({
          action: action.title,
          impact: action.impact,
          color: action.severity === 'High' ? 'rgb(239, 68, 68)' : 'rgb(249, 115, 22)'
        }));

        return (
          <div className="h-[500px]">
            <ResponsiveBar
              data={priorityData}
              keys={['impact']}
              indexBy="action"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={{ scheme: 'red_yellow_blue' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Action',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Impact Score',
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

      case 'impactForecast':
        const impactData = [
          {
            id: 'High',
            label: 'High Impact',
            value: actions.filter(a => a.severity === 'High').length,
            color: 'rgb(239, 68, 68)'
          },
          {
            id: 'Medium',
            label: 'Medium Impact',
            value: actions.filter(a => a.severity === 'Medium').length,
            color: 'rgb(249, 115, 22)'
          },
          {
            id: 'Low',
            label: 'Low Impact',
            value: actions.filter(a => a.severity === 'Low').length,
            color: 'rgb(234, 179, 8)'
          }
        ];

        return (
          <div className="h-[500px]">
            <ResponsivePie
              data={impactData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'red_yellow_blue' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle'
                }
              ]}
            />
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Team Comments</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Add your comment..."
              />
              <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Add Comment
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CollapsibleSidebar
        options={actionOptions}
        selectedOption={selectedView}
        onOptionSelect={setSelectedView}
      />
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {actionOptions.find(opt => opt.id === selectedView)?.title || 'Suggested Actions'}
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

export default SuggestedActions; 