import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../store/slices/authSlice';
import { Users, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Team = () => {
    const dispatch = useDispatch();
    const { users, usersLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    return (
        <div className="p-8 space-y-8 h-screen overflow-y-auto custom-scrollbar">
            <header>
                <h1 className="text-3xl font-bold mb-1">Team Members</h1>
                <p className="text-gray-400 text-sm">View and manage your team.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, idx) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-xl font-bold border border-primary-500/20">
                            {user.name.charAt(0)}
                        </div>

                        <div className="overflow-hidden">
                            <h3 className="font-bold text-lg truncate">{user.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <Mail size={14} />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                ${user.role === 'admin' ? 'bg-rose-500/10 text-rose-400' :
                                    user.role === 'manager' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-blue-500/10 text-blue-400'}
              `}>
                                {user.role}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Team;
