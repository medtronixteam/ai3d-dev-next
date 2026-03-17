import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [queueData, setQueueData] = useState(null);

  useEffect(() => {
    const socket = io('https://node.ai3dscanning.com');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Connected sockets ${socket.id}`, 'success');
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`, 'error');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.log(`Connection Error: ${error.message}`, 'error');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const queue_system = useCallback((projectId, fcmToken) => {

    if (!socketRef.current) {
      console.log('Socket not ready', 'error');
      return;
    }

    if (!projectId || !fcmToken) {
      console.log('Missing projectId or fcmToken', 'error');
      return;
    }

    console.log(`Project ID: ${projectId}`, 'info');
    console.log(`FCM Token: ${fcmToken.substring(0, 20)}...`, 'info');

    socketRef.current.emit('register-device', { deviceId : projectId });

    socketRef.current.on('status_update', (data) => {
      console.log('Queue update:', data);
      setQueueData(data);
    });
  }, []);

  const frame_extraction = useCallback((videoProjectToken, fcmToken) => {
    if (!socketRef.current) {
      console.log('Socket not ready', 'error');
      return;
    }

    if (!videoProjectToken || !fcmToken) {
      console.log('Missing videoProjectToken or fcmToken', 'error');
      return;
    }

    console.log(`Project Token: ${videoProjectToken}`, 'info');
    console.log(`FCM Token: ${fcmToken.substring(0, 20)}...`, 'info');

    socketRef.current.emit('register-device', { projectToken: videoProjectToken, fcmToken });

    socketRef.current.on('frame_extraction', (data) => {
    console.log('Frame extraction update:', data);
    });

  }, []);

  const subscribe = useCallback((eventName, callback) => {
    if (!socketRef.current || !eventName) {
      console.log('Cannot subscribe: invalid socket or event', 'error');
      return () => {};
    }

    console.log(`Subscribed to: ${eventName}`, 'success');

    const wrappedCallback = (data) => {
      console.log(`Received data on ${eventName}`, 'success');
      console.log(`Data: ${JSON.stringify(data).substring(0, 100)}...`, 'info');
      callback(data);
    };

    socketRef.current.on(eventName, wrappedCallback);

    return () => {
      console.log(`Unsubscribed from: ${eventName}`, 'info');
      socketRef.current?.off(eventName, wrappedCallback);
    };
  }, []);

  const value = {
    socket: socketRef.current,
    connected,
    queueData,
    queue_system,
    frame_extraction,
    subscribe,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};