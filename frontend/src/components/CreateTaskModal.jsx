import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../store/slices/taskSlice';
import { fetchAllUsers } from '../store/slices/authSlice';
import { getProjects } from '../store/slices/projectSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, AlertCircle } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.auth);
    const { projects } = useSelector((state) => state.projects);
    const { isLoading, isError, message } = useSelector((state) => state.tasks);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignee: '',
        project: '',
        tags: ''
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchAllUsers());
            dispatch(getProjects());
        }
    }, [isOpen, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
        };

        // Remove empty fields to let backend defaults handle them
        if (!taskData.dueDate) delete taskData.dueDate;
        if (!taskData.assignee) delete taskData.assignee;
        if (!taskData.project) delete taskData.project;

        const result = await dispatch(createTask(taskData));
        if (createTask.fulfilled.match(result)) {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                dueDate: '',
                assignee: '',
                project: '',
                tags: ''
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold text-white">Create New Task</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isError && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-2">
                                    <AlertCircle size={20} />
                                    <span>{typeof message === 'object' ? message.message : message}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Redesign Homepage Hero Section"
                                    className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-white placeholder-gray-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <textarea
                                    placeholder="Add detailed instructions..."
                                    className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-white placeholder-gray-500 custom-scrollbar"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Priority</label>
                                    <select
                                        className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 appearance-none text-white cursor-pointer"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Project</label>
                                    <select
                                        className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 appearance-none text-white cursor-pointer"
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                    >
                                        <option value="">No Project</option>
                                        {projects.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Calendar size={16} /> Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 text-white" // calendar-picker-indicator styling requires CSS override or custom component ideally
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <User size={16} /> Assignee
                                    </label>
                                    <select
                                        className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 appearance-none text-white cursor-pointer"
                                        value={formData.assignee}
                                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Tag size={16} /> Tags
                                </label>
                                <input
                                    type="text"
                                    placeholder="design, urgent, frontend (comma separated)"
                                    className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-white placeholder-gray-500"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateTaskModal;
