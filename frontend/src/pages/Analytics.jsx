import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const { user } = useSelector((state) => state.auth);
    const [teamStats, setTeamStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeamStats = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
                // Admin/Manager route
                if (user.role === 'admin' || user.role === 'manager') {
                    const res = await axios.get('http://localhost:5000/api/analytics/team-performance', config);
                    setTeamStats(res.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchTeamStats();
    }, [user]);

    if (user.role === 'user') {
        return (
            <div className="p-8 h-screen flex items-center justify-center text-gray-500">
                <p>Analytics are only available for Managers and Admins.</p>
            </div>
        );
    }

    return (
        <div className="p-8 h-screen overflow-y-auto custom-scrollbar">
            <h1 className="text-3xl font-bold mb-8">Team Analytics</h1>

            {loading && <p>Loading data...</p>}
            {error && <p className="text-rose-400">{error}</p>}

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Team Performance</h3>
                <div className="h-96">
                    <Bar
                        data={{
                            labels: teamStats.map(s => s.name),
                            datasets: [
                                {
                                    label: 'Tasks Completed',
                                    data: teamStats.map(s => s.completed),
                                    backgroundColor: '#10b981',
                                    borderRadius: 4
                                },
                                {
                                    label: 'Total Tasks Assigned',
                                    data: teamStats.map(s => s.total),
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 4
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
