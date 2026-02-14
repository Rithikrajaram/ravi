import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../store/slices/projectSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, AlertCircle } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isLoading, isError, message } = useSelector((state) => state.projects);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createProject(formData));
        if (createProject.fulfilled.match(result)) {
            setFormData({
                name: '',
                description: '',
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
                    className="relative w-full max-w-lg bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-600/20 p-2 rounded-lg text-primary-400">
                                <Folder size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Create New Project</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isError && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-2">
                                    <AlertCircle size={20} />
                                    <span>{typeof message === 'object' ? message.message : message}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Website Redesign"
                                    className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-white placeholder-gray-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <textarea
                                    placeholder="Briefly describe what this project is about..."
                                    className="w-full bg-dark-lighter border border-white/10 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-white placeholder-gray-500 custom-scrollbar"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    {isLoading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateProjectModal;
