import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus
} from 'lucide-react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import CreateTaskModal from '../components/CreateTaskModal';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
                const res = await axios.get('http://localhost:5000/api/analytics/dashboard', config);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [user]);

    const cards = [
        { label: 'Completion Rate', value: '85%', icon: <TrendingUp className="text-emerald-400" />, color: 'emerald' },
        { label: 'Overdue Tasks', value: stats?.overdueCount || '0', icon: <AlertCircle className="text-rose-400" />, color: 'rose' },
        { label: 'Active Tasks', value: stats?.statusStats?.find(s => s._id === 'in-progress')?.count || '0', icon: <Clock className="text-amber-400" />, color: 'amber' },
        { label: 'Completed', value: stats?.statusStats?.find(s => s._id === 'completed')?.count || '0', icon: <CheckCircle2 className="text-blue-400" />, color: 'blue' },
    ];

    const doughnutData = {
        labels: stats?.statusStats?.map(s => s._id) || [],
        datasets: [{
            data: stats?.statusStats?.map(s => s.count) || [],
            backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
            borderWidth: 0,
        }]
    };

    return (
        <div className="p-8 space-y-8 overflow-y-auto h-screen custom-scrollbar relative">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-gray-400 text-sm">Here's what's happening with your tasks today.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Task
                </button>
            </header>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={card.label}
                        className="glass-card p-6 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-gray-400 text-sm font-medium">{card.label}</span>
                            {card.icon}
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold">{card.value}</span>
                            <div className="mt-2 text-xs text-gray-400">
                                <span className="text-emerald-400">+12%</span> from last week
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Productivity Trend</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                datasets: [{
                                    label: 'Tasks Completed',
                                    data: [12, 19, 3, 5, 2, 3, 7],
                                    backgroundColor: '#0ea5e9',
                                    borderRadius: 8,
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-6">Task Distribution</h3>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="h-48 w-48">
                            <Doughnut
                                data={doughnutData}
                                options={{ cutout: '75%', plugins: { legend: { display: false } } }}
                            />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {stats?.statusStats?.map((s, i) => (
                            <div key={s._id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></div>
                                    <span className="capitalize text-gray-400">{s._id}</span>
                                </div>
                                <span className="font-semibold">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
