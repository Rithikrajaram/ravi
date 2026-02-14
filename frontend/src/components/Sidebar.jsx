import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Target
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/tasks' },
        { icon: <FolderKanban size={20} />, label: 'Projects', path: '/projects' },
        { icon: <Users size={20} />, label: 'Team', path: '/team' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <div className="h-screen w-64 bg-dark-lighter border-r border-white border-opacity-5 flex flex-col p-4">
            <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                <div className="bg-primary-600 p-2 rounded-lg">
                    <Target className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    TaskNexus
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                                ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white border-opacity-5">
                <div className="px-4 py-3 mb-4 flex items-center gap-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={() => dispatch(logout())}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
