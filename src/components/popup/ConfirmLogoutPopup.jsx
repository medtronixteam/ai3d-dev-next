import React from 'react';
import './ConfirmLogoutPopup.css';
import { FiTrash2, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = 'Yes', cancelText = 'No', error, iconType }) => {
  if (!open) return null;
  return (
    <div className="confirm-logout-overlay" onClick={onClose}>
      <div className="confirm-logout-popup modern-confirm-modal" onClick={e => e.stopPropagation()}>
        {error && <div className="confirm-modal-error">{error}</div>}
        <div className="confirm-modal-icon-wrap">
          {iconType === 'success' ? (
            <FiCheckCircle size={38} color="#27ae60" />
          ) : iconType === 'warning' ? (
            <FiAlertTriangle size={38} color="#e6339a" />
          ) : (
            <FiTrash2 size={38} color="#e6339a" />
          )}
        </div>
        <div className="popup-header">
          <h4 className="confirm-modal-title">{title || 'Are you sure?'}</h4>
        </div>
        <div className="popup-body">
          <p className="confirm-modal-message">{message || 'Do you really want to proceed?'}</p>
        </div>
        <div className="popup-footer confirm-modal-footer">
          {cancelText && <button className="btn btn-cancel confirm-btn" onClick={onClose}>{cancelText}</button>}
          <button className="btn btn-create confirm-btn btn-danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 