import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../store/slices/projectSlice';
import { Plus, Folder, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import CreateProjectModal from '../components/CreateProjectModal';

const Projects = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.projects);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getProjects());
    }, [dispatch]);

    return (
        <div className="p-8 space-y-8 h-screen overflow-y-auto custom-scrollbar">
            <CreateProjectModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Projects</h1>
                    <p className="text-gray-400 text-sm">Manage your team's projects and workspaces.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 glass-card-hover group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary-600/20 p-3 rounded-xl text-primary-400">
                                <Folder size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize
                ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}
              `}>
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{project.name}</h3>
                        <p className="text-sm text-gray-400 mb-6 line-clamp-2">{project.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users size={16} />
                                <span>{project.members?.length || 1} Members</span>
                            </div>
                            <div className="flex -space-x-2">
                                {project.members?.slice(0, 3).map((m, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-dark-lighter border border-dark flex items-center justify-center text-xs font-bold text-gray-300">
                                        {/* Placeholder for member avatar/initial */}
                                        U
                                    </div>
                                ))}
                                {(project.members?.length > 3) && (
                                    <div className="w-8 h-8 rounded-full bg-dark-lighter border border-dark flex items-center justify-center text-xs font-bold text-gray-300">
                                        +{project.members.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                        <Folder size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">No projects found</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 text-primary-400 hover:underline"
                        >
                            Create your first project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
