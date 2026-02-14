import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks } from '../store/slices/taskSlice';
import {
    MoreVertical,
    Calendar,
    MessageSquare,
    Paperclip,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const statuses = ['todo', 'in-progress', 'review', 'completed'];

const TaskCard = ({ task }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-4 glass-card-hover cursor-grab active:cursor-grabbing group"
    >
        <div className="flex justify-between items-start mb-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
        ${task.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                    task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                        task.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-emerald-500/20 text-emerald-400'}
      `}>
                {task.priority}
            </span>
            <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
            </button>
        </div>

        <h4 className="font-semibold text-sm mb-2">{task.title}</h4>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{task.description}</p>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                    <MessageSquare size={12} /> <span>3</span>
                </div>
                <div className="flex items-center gap-1">
                    <Paperclip size={12} /> <span>1</span>
                </div>
            </div>

            <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary-600 border border-dark text-[10px] flex items-center justify-center font-bold">
                    {task.assignee?.name?.charAt(0)}
                </div>
            </div>
        </div>
    </motion.div>
);

import CreateTaskModal from '../components/CreateTaskModal';

const Tasks = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading } = useSelector((state) => state.tasks);
    const [filter, setFilter] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    return (
        <div className="p-8 space-y-8 flex flex-col h-screen overflow-hidden relative">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Board</h1>
                    <p className="text-gray-400 text-sm">Manage and track your project tasks.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 w-64"
                        />
                    </div>
                    <button className="glass-card p-2 text-gray-400 hover:text-white">
                        <SlidersHorizontal size={20} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="glass-card p-2 text-primary-400 hover:text-white hover:bg-primary-600 border-primary-500/20"
                    >
                        <span className="font-bold">+ New Task</span>
                    </button>
                </div>
            </header>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-max">
                    {statuses.map((status) => (
                        <div key={status} className="w-80 flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="capitalize font-bold text-sm text-gray-300">{status.replace('-', ' ')}</h3>
                                    <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-gray-500">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="text-gray-500 hover:text-white"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                {tasks
                                    .filter(t => t.status === status)
                                    .map(task => <TaskCard key={task._id} task={task} />)
                                }

                                {tasks.filter(t => t.status === status).length === 0 && (
                                    <div className="border-2 border-dashed border-white/5 rounded-2xl h-32 flex items-center justify-center text-gray-600 text-sm">
                                        No tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
