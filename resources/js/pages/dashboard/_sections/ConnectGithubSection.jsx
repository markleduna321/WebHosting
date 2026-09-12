import React from 'react';
import { Modal } from 'antd';

export default function ConnectGithubSection({ open, onCancel, onConnect }) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={480}
      footer={null}
    >
      {/* Modal Container */}
      <div className="relative w-full rounded-3xl bg-white/90 p-8 overflow-hidden text-center">
        
        {/* Soft Colorful Background Glows */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Content */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* GitHub Large Logo Container */}
          <div className="mb-6 flex items-center justify-center">
            <div className="w-28 h-28 bg-[#181d23] rounded-full flex items-center justify-center shadow-sm">
              {/* GitHub Cat Silhouette SVG */}
              <svg 
                className="w-20 h-20 fill-white" 
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Connect your GitHub account
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm max-w-sm font-medium leading-relaxed mb-8">
            Magic Patterns can pull in your product, components and styles directly from your real codebase.
          </p>

          {/* Connect Button */}
          <button 
            type="button"
            onClick={() => onConnect?.()}
            className="flex items-center justify-center gap-2.5 bg-[#0d151a] hover:bg-black text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all transform active:scale-95 text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Connect GitHub</span>
          </button>

        </div>
      </div>
    </Modal>
  );
}