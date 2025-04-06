import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import { motion } from 'framer-motion';

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
    title: "\ud83d\udea8 Priority Actions",
    desc: "High-priority maintenance tasks",
    icon: "\ud83d\udea8"
  },
  {
    id: "alertPriority",
    title: "\ud83d\udcca Alert Prioritization",
    desc: "Ranked list of alerts by severity",
    icon: "\ud83d\udcca"
  },
  {
    id: "impactForecast",
    title: "\ud83d\udcc8 Impact Forecast",
    desc: "Predicted impact of anomalies",
    icon: "\ud83d\udcc8"
  },
  {
    id: "comments",
    title: "\ud83d\udcac Team Comments",
    desc: "Collaboration and notes",
    icon: "\ud83d\udcac"
  }
];

const SuggestedActions: React.FC = () => {
  const [selectedView, setSelectedView] = useState('priorityActions');
  const navigate = useNavigate();

  const actions = useMemo(() => {
    return [
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
  }, []);

  const renderContent = () => {
    switch (selectedView) {
      case 'priorityActions':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">High Priority Actions</h2>
            <div className="grid gap-4">
              {actions.filter(action => action.severity === 'High').map(action => (
                <motion.div
                  key={action.id}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-red-500">Impact: {action.impact}%</span>
                    <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                      {action.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'alertPriority':
        const priorityData = actions.map(action => ({
          action: action.title,
          impact: action.impact
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
              axisBottom={{ tickRotation: -45, legend: 'Action', legendOffset: 40 }}
              axisLeft={{ legend: 'Impact Score', legendOffset: -40 }}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[{ anchor: 'bottom-right', direction: 'column', translateX: 120, itemWidth: 100, itemHeight: 20 }]} />
          </div>
        );

      case 'impactForecast':
        const impactData = [
          { id: 'High', label: 'High Impact', value: actions.filter(a => a.severity === 'High').length },
          { id: 'Medium', label: 'Medium Impact', value: actions.filter(a => a.severity === 'Medium').length },
          { id: 'Low', label: 'Low Impact', value: actions.filter(a => a.severity === 'Low').length }
        ];
        return (
          <div className="h-[500px]">
            <ResponsivePie
              data={impactData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'red_yellow_blue' }}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[{ anchor: 'bottom', direction: 'row', translateY: 56, itemWidth: 100, itemHeight: 18, symbolSize: 18 }]} />
          </div>
        );

      case 'comments':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Team Comments</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <textarea className="w-full p-2 border rounded" rows={4} placeholder="Add your comment..." />
              <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Add Comment
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
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
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              ← Back to Dashboard
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SuggestedActions;