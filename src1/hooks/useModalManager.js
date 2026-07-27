import { useState, useCallback } from 'react';

/**
 * Custom hook to manage multiple modals with automatic closing behavior
 * When a new modal opens, all other modals are automatically closed
 */
export const useModalManager = () => {
  // Define all possible modal types
  const modalTypes = {
    MODEL_DETAILS: 'modelDetails',
    VIDEO_MODAL: 'videoModal',
    PROMPT_MODAL: 'promptModal',
    SCAN_MODAL: 'scanModal',
    MODEL_MODAL: 'modelModal',
    MODEL_VIDEO_MODAL: 'modelVideoModal',
  };

  // State to track which modal is currently open
  const [activeModal, setActiveModal] = useState(null);
  
  // State to store modal-specific data
  const [modalData, setModalData] = useState({});

  /**
   * Open a modal and close any previously open modal
   * @param {string} modalType - The type of modal to open
   * @param {object} data - Optional data to pass to the modal
   */
  const openModal = useCallback((modalType, data = {}) => {
    // Close any existing modal first
    if (activeModal) {
      setActiveModal(null);
      setModalData({});
    }
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setActiveModal(modalType);
      setModalData(data);
    }, 50);
  }, [activeModal]);

  /**
   * Close the currently active modal
   */
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  /**
   * Close all modals
   */
  const closeAllModals = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  /**
   * Check if a specific modal is open
   * @param {string} modalType - The modal type to check
   * @returns {boolean}
   */
  const isModalOpen = useCallback((modalType) => {
    return activeModal === modalType;
  }, [activeModal]);

  /**
   * Get data for a specific modal
   * @param {string} modalType - The modal type
   * @returns {object}
   */
  const getModalData = useCallback((modalType) => {
    return activeModal === modalType ? modalData : {};
  }, [activeModal, modalData]);

  return {
    modalTypes,
    activeModal,
    modalData,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,
  };
};

















