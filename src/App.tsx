import { useState } from 'react';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DashboardScreen } from './components/DashboardScreen.tsx';
import { UploadIngestionScreen } from './components/UploadIngestionScreen.tsx';
import { LedgerListScreen } from './components/LedgerListScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { TransactionDetailModal } from './components/TransactionDetailModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData.ts';
import { Transaction, AppSettings, AppNotification } from './types.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [incomingUploadFile, setIncomingUploadFile] = useState<File | null>(null);

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Add newly scanned transaction
  const handleSaveTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Create notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'បានកត់ត្រាវិក្កយបត្រថ្មី',
      message: `${newTx.vendor} ($${newTx.amountUSD.toFixed(2)}) ត្រូវបានរក្សាទុកក្នុងសៀវភៅធំ។`,
      time: 'ទើបតែឥឡូវនេះ',
      read: false,
      type: 'ai',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Toggle status (paid / pending)
  const handleToggleStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'paid' ? 'pending' : 'paid';
          return {
            ...t,
            status: nextStatus,
            statusTextKh: nextStatus === 'paid' ? 'បានបង់' : 'ជំពាក់',
          };
        }
        return t;
      })
    );
    if (selectedTransaction && selectedTransaction.id === id) {
      const nextStatus = selectedTransaction.status === 'paid' ? 'pending' : 'paid';
      setSelectedTransaction({
        ...selectedTransaction,
        status: nextStatus,
        statusTextKh: nextStatus === 'paid' ? 'បានបង់' : 'ជំពាក់',
      });
    }
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Navigation helpers
  const handleNavigateToUpload = (file?: File) => {
    if (file) {
      setIncomingUploadFile(file);
    } else {
      setIncomingUploadFile(null);
    }
    setCurrentTab('upload-ingestion');
  };

  const handleNavigateToLedger = () => {
    setCurrentTab('ledger-list');
  };

  return (
    <div className="min-h-screen bg-[#eceef0] flex justify-center selection:bg-secondary/20 selection:text-secondary">
      {/* Container simulating mobile frame or responsive view */}
      <div className="w-full max-w-md min-h-screen bg-surface flex flex-col relative shadow-2xl border-x border-surface-container-high/40">
        {/* Top Sticky Header */}
        <Header
          currentTab={currentTab}
          unreadNotifsCount={unreadNotifsCount}
          onOpenNotifications={() => setShowNotifications(true)}
          onGoToSettings={() => setCurrentTab('settings')}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
          {currentTab === 'dashboard' && (
            <DashboardScreen
              transactions={transactions}
              settings={settings}
              onNavigateToUpload={handleNavigateToUpload}
              onNavigateToLedger={handleNavigateToLedger}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {currentTab === 'upload-ingestion' && (
            <UploadIngestionScreen
              settings={settings}
              onSaveTransaction={handleSaveTransaction}
              initialFile={incomingUploadFile}
            />
          )}

          {currentTab === 'ledger-list' && (
            <LedgerListScreen
              transactions={transactions}
              settings={settings}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onRefresh={() => {}}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>

        {/* Bottom Fixed Navigation Bar */}
        <BottomNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

        {/* Detailed Transaction Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTransaction}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          notifications={notifications}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }}
          onClear={() => setNotifications([])}
        />
      </div>
    </div>
  );
}
