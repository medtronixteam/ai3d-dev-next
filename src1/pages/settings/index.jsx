import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsPage = () => {
  return (
    <div
      className="settings-page-root"
      style={{ display: 'flex', minHeight: '100%', height: '100%' }}
    >
      {/* The custom sidebar will be rendered by MainLayout logic */}
      <div style={{ flex: 1, minHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage; 