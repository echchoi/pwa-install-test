import React from 'react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Add to Home Screen on iOS</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <p>Tap the <strong>Safari share button</strong> (the square with an arrow icon) at the bottom of your screen.</p>
              <div className="screenshot-container">
                <div className="screenshot-placeholder">
                  <p>Safari Share Button Screenshot</p>
                </div>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <p>Scroll down and tap <strong>Add to Home Screen</strong> in the sharing menu.</p>
              <div className="screenshot-container">
                <div className="screenshot-placeholder">
                  <p>Add to Home Screen Option Screenshot</p>
                </div>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <p>Tap <strong>Add</strong> in the top-right corner to confirm.</p>
              <div className="screenshot-container">
                <div className="screenshot-placeholder">
                  <p>Add Button Screenshot</p>
                </div>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <p>Your PWA is now installed! Find it on your home screen.</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>
  );
};

export default IOSInstallModal;