import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  // モーダルが開いているときにスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // モーダルの背景がクリックされた場合のみ onClose を呼ぶ
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-60 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[clamp(200px,500px,90%)] relative">
        <button onClick={onClose} className="absolute w-7 h-7 top-2 right-2 text-zinc-600 text-2xl grid place-items-center">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
