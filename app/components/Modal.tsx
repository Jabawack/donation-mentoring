'use client';

import { useRef, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  darkMode?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  darkMode = true,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownTargetRef.current = e.target;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only close if both mousedown and mouseup happened on the backdrop (not a drag from inside)
    if (e.target === backdropRef.current && mouseDownTargetRef.current === backdropRef.current) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const dm = {
    bgCard: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    textSubtle: darkMode ? 'text-gray-500' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
  };

  return (
    <div
      ref={backdropRef}
      data-testid="modal-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        data-testid="modal-content"
        className={`${dm.bgCard} border ${dm.border} rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] flex flex-col transition-colors duration-300`}
      >
        {/* Header */}
        <div className={`flex-shrink-0 ${dm.bgCard} border-b ${dm.border} px-5 py-4 flex justify-between items-center`}>
          <h2 className={`text-lg font-semibold ${dm.text}`}>{title}</h2>
          <button
            onClick={onClose}
            data-testid="modal-close-button"
            className={`p-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-400 hover:text-gray-200' : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-500 hover:text-gray-700'} rounded-lg transition-colors active:scale-95`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`flex-shrink-0 ${dm.bgCard} px-5 py-4 flex justify-end gap-3 border-t ${dm.border}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
