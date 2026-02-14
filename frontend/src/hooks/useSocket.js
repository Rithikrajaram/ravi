import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useSocket = () => {
    const socket = useRef();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            socket.current = io('http://localhost:5000');

            socket.current.on('connect', () => {
                console.log('Connected to socket');
            });

            return () => {
                socket.current.disconnect();
            };
        }
    }, [user]);

    return socket.current;
};
