import React from 'react';

interface VideoModalProps {
  show: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          ✖
        </button>

        {/* Video Content */}
        <div className="p-6">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/AHGvVK3s6fY" 
            title="Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
