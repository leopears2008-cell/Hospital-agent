import { useState } from 'react';
import { Bell, CheckCircle, Clock, Info, X } from 'lucide-react';
import { Notification } from '../types';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: 'test',
      title: 'Appointment Confirmed',
      description: 'Your appointment with Dr. Kumar is confirmed for Aug 28 at 10:30 AM.',
      timestamp: Date.now() - 1000 * 60 * 60,
      read: false,
      type: 'appointment'
    },
    {
      id: '2',
      userId: 'test',
      title: 'Profile Updated',
      description: 'Your patient profile has been updated successfully.',
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      read: true,
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'medical': return <Info className="w-4 h-4 text-emerald-600" />;
      default: return <CheckCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>You're all caught up.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors ${notification.read ? 'opacity-70 bg-white' : 'bg-blue-50/30'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === 'appointment' ? 'bg-blue-100' :
                        notification.type === 'medical' ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-bold truncate ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap pt-0.5">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
