'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';

export const useWebSocket = (url: string) => {
    const socketRef = useRef<WebSocket | null>(null);
    const { appendLog, setStatus } = useEditorStore();

    const connect = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Connected to Orvyn WebSocket');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'progress') {
                appendLog(data.message);
                if (data.stage === 'done') {
                    setStatus('idle');
                } else {
                    setStatus('parsing'); // or use the stage directly
                }
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from Orvyn WebSocket');
            // Reconnect after 3 seconds
            setTimeout(connect, 3000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }, [url, appendLog, setStatus]);

    useEffect(() => {
        connect();
        return () => {
            socketRef.current?.close();
        };
    }, [connect]);

    const send = useCallback((message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    }, []);

    return { send };
};
