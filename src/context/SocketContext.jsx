import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [queueData, setQueueData] = useState(null);

  const activeDeviceIdRef = useRef(null);
  const activeVideoTokenRef = useRef(null);
  const activeFcmTokenRef = useRef(null);

  useEffect(() => {
    const socket = io('https://node.ai3dscanning.com');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Connected sockets ${socket.id}`, 'success');
      setConnected(true);

      // Auto re-register active deviceId or videoToken upon reconnection
      if (activeDeviceIdRef.current) {
        console.log(`Auto re-registering active deviceId: ${activeDeviceIdRef.current} on reconnect`);
        socket.emit('register-device', { deviceId: activeDeviceIdRef.current });
      }
      if (activeVideoTokenRef.current) {
        console.log(`Auto re-registering active projectToken: ${activeVideoTokenRef.current} on reconnect`);
        socket.emit('register-device', { 
          projectToken: activeVideoTokenRef.current, 
          fcmToken: activeFcmTokenRef.current 
        });
      }
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

    if (!projectId) {
      console.log('Missing projectId', 'error');
      return;
    }

    // Save active registration details for reconnection auto-recovery
    activeDeviceIdRef.current = projectId;
    activeFcmTokenRef.current = fcmToken;
    activeVideoTokenRef.current = null;

    console.log(`Project ID: ${projectId}`, 'info');
    if (fcmToken) {
      console.log(`FCM Token: ${fcmToken.substring(0, 20)}...`, 'info');
    }

    socketRef.current.emit('register-device', { deviceId: projectId, projectId });

    socketRef.current.off('status_update');

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

    // Save active registration details for reconnection auto-recovery
    activeVideoTokenRef.current = videoProjectToken;
    activeFcmTokenRef.current = fcmToken;
    activeDeviceIdRef.current = null;

    console.log(`Project Token: ${videoProjectToken}`, 'info');
    console.log(`FCM Token: ${fcmToken.substring(0, 20)}...`, 'info');

    socketRef.current.emit('register-device', { projectToken: videoProjectToken, fcmToken });

    socketRef.current.off('frame_extraction');

    socketRef.current.on('frame_extraction', (data) => {
      console.log('Frame extraction update:', data);
    });

  }, []);

  const clearActiveQueueRegistration = useCallback(() => {
    activeDeviceIdRef.current = null;
    activeVideoTokenRef.current = null;
    activeFcmTokenRef.current = null;
    setQueueData(null);
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
    clearActiveQueueRegistration,
    subscribe,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};