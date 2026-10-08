import React from 'react';
import { AppNotification } from '../types.ts';

interface NotificationsModalProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-16 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              notifications_active
            </span>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">
              ការជូនដំណឹង (Notifications)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto divide-y divide-surface-container-low p-2">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant text-xs">
              មិនមានការជូនដំណឹងថ្មីទេ
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl transition-colors ${
                  notif.read ? 'bg-transparent' : 'bg-surface-container-low/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                      notif.type === 'ai'
                        ? 'bg-secondary'
                        : notif.type === 'ledger'
                        ? 'bg-amber-600'
                        : 'bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {notif.type === 'ai'
                        ? 'smart_toy'
                        : notif.type === 'ledger'
                        ? 'receipt'
                        : 'info'}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-on-surface truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-on-surface-variant shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-surface-container-low/50 border-t border-surface-container-low flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="text-secondary font-semibold hover:underline"
            >
              សម្គាល់ថាបានអានទាំងអស់
            </button>
            <button onClick={onClear} className="text-on-surface-variant hover:text-error">
              សម្អាត
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
