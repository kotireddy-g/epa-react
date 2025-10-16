import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from './ui/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedTo?: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Validation Completed',
      message: 'Your idea "AI-Powered Learning Platform" has scored 85% in validation.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      relatedTo: 'validation',
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Business Plan Due',
      message: 'Complete your business plan for "Mobile App for Fitness" by tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
      relatedTo: 'business-plan',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Resource Available',
      message: 'Check out the latest guide on "Startup Funding Strategies" in suggestions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: true,
      relatedTo: 'resources',
    },
    {
      id: '4',
      type: 'warning',
      title: 'Task Overdue',
      message: 'The task "Market Research" is overdue by 2 days.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: false,
      relatedTo: 'implementation',
    },
    {
      id: '5',
      type: 'success',
      title: 'Milestone Achieved',
      message: 'Congratulations! You\'ve completed 50% of your implementation plan.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isRead: true,
      relatedTo: 'outcomes',
    },
    {
      id: '6',
      type: 'info',
      title: 'Idea Saved',
      message: 'Your new idea "E-commerce Platform for Local Artisans" has been saved as draft.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isRead: true,
      relatedTo: 'idea',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <p className="text-gray-600">Stay updated with your ideas and progress</p>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setFilter('unread')}>
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read" onClick={() => setFilter('read')}>
            Read ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No notifications to display</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                !notification.isRead && "border-l-4 border-l-blue-500 bg-blue-50/50"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={cn(
                        "text-gray-900",
                        !notification.isRead && "font-semibold"
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    {notification.relatedTo && (
                      <Badge variant="outline" className="text-xs">
                        {notification.relatedTo}
                      </Badge>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
