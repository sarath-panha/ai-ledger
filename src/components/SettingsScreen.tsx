import React, { useState } from 'react';
import { AppSettings } from '../types.ts';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [isUpdatingRate, setIsUpdatingRate] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>(settings.userName);
  const [profileRole, setProfileRole] = useState<string>(settings.userRole);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showRateModal, setShowRateModal] = useState<boolean>(false);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  // Live Exchange Rate refresh
  const handleRefreshRate = async () => {
    setIsUpdatingRate(true);
    try {
      const res = await fetch('/api/exchange-rate');
      if (res.ok) {
        const data = await res.json();
        if (data.rate) {
          onUpdateSettings({ exchangeRate: data.rate });
        }
      }
    } catch {
      // Fallback
      onUpdateSettings({ exchangeRate: 4100 });
    } finally {
      setTimeout(() => {
        setIsUpdatingRate(false);
      }, 600);
    }
  };

  const handleSaveProfile = () => {
    onUpdateSettings({
      userName: profileName,
      userRole: profileRole,
    });
    setShowEditProfile(false);
  };

  return (
    <div className="flex flex-col w-full px-margin pb-32 pt-2">
      {/* Title */}
      <div className="relative w-full mb-space-md">
        <div className="flex flex-col pt-1">
          <h1 className="font-headline-lg text-[22px] text-on-surface font-bold">
            ការកំណត់កម្មវិធី
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            គ្រប់គ្រងគណនី និងការកំណត់ AI របស់អ្នក
          </p>
        </div>
      </div>

      {/* Profile Mini Card */}
      <section className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container-high/60 mb-space-lg relative overflow-hidden">
        <div className="flex items-center gap-space-md relative z-10">
          <div className="relative shrink-0">
            <img
              alt={settings.userName}
              className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-surface-container-high"
              src={settings.userAvatar}
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-white ring-2 ring-white">
              <span className="material-symbols-outlined text-[10px] font-bold">check</span>
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-headline-sm text-[16px] text-on-surface font-bold truncate">
              {settings.userName}
            </h2>
            <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
              {settings.userRole}
            </p>
          </div>

          <button
            onClick={() => setShowEditProfile(true)}
            aria-label="Edit Profile"
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center shrink-0 active:scale-95 transition-transform hover:bg-surface-container-high"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </section>

      {/* General Settings */}
      <div className="flex flex-col mb-space-lg">
        <div className="flex items-center gap-space-xs mb-space-sm px-1">
          <div className="w-6 h-6 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </div>
          <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
            ការកំណត់ទូទៅ (General Settings)
          </h3>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high/60 p-space-md flex flex-col gap-space-md">
          {/* Currency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  រូបិយប័ណ្ណ (Currency)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {settings.currency === 'USD_KHR'
                    ? 'ប្រាក់ដុល្លារ និង ប្រាក់រៀល'
                    : settings.currency === 'USD'
                    ? 'ប្រាក់ដុល្លារ ($)'
                    : 'ប្រាក់រៀល (៛)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowRateModal(true)}
              className="px-3 py-1.5 bg-surface-container-low rounded-xl text-on-surface font-label-md text-label-md flex items-center gap-1 shrink-0 font-semibold hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span>{settings.currency === 'USD_KHR' ? 'USD / KHR' : settings.currency}</span>
              <span className="material-symbols-outlined text-[16px]">unfold_more</span>
            </button>
          </div>

          {/* Exchange Rate */}
          <div className="bg-surface-container-low/70 rounded-xl p-space-sm flex items-center justify-between border border-surface-container-high/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  អត្រាប្តូរប្រាក់ (Rate)
                </span>
                <span className="font-financial-numeric text-[16px] text-on-surface font-bold">
                  1$ = {settings.exchangeRate.toLocaleString()} ៛
                </span>
              </div>
            </div>

            <button
              onClick={handleRefreshRate}
              disabled={isUpdatingRate}
              className="font-label-sm text-[11px] font-semibold bg-surface-container-lowest text-secondary px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 active:scale-95 transition-transform hover:bg-surface-container-low"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[14px] ${
                  isUpdatingRate ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span>{isUpdatingRate ? 'កំពុងទាញ...' : 'បច្ចុប្បន្នភាព'}</span>
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  ភាសា (Language)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  ភាសាប្រើប្រាស់ក្នុងកម្មវិធី
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLanguageModal(true)}
              className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl shrink-0 font-semibold text-[13px] hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span>{settings.language === 'km' ? 'ភាសាខ្មែរ' : 'English'}</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                keyboard_arrow_right
              </span>
            </button>
          </div>

          {/* Cloud Backup Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  បម្រុងទុកទិន្នន័យ (Cloud Backup)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  រក្សាទុកទិន្នន័យស្វ័យប្រវត្តិជារៀងរាល់ថ្ងៃ
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ autoBackup: !settings.autoBackup })}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                settings.autoBackup ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
              type="button"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.autoBackup ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* AI Automation Section */}
      <div className="flex flex-col mb-space-lg">
        <div className="flex items-center gap-space-xs mb-space-sm px-1">
          <div className="w-6 h-6 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
          </div>
          <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
            ការកំណត់ AI & OCR (AI Configuration)
          </h3>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high/60 p-space-md flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                កម្រិតភាពជឿជាក់ AI (Confidence Threshold)
              </span>
              <span className="font-financial-numeric text-[14px] text-secondary font-bold">
                {settings.aiConfidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="85"
              max="99"
              value={settings.aiConfidenceThreshold}
              onChange={(e) =>
                onUpdateSettings({ aiConfidenceThreshold: parseInt(e.target.value, 10) })
              }
              className="w-full accent-secondary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-on-surface-variant mt-1 block">
              AI នឹងស្នើសុំការពិនិត្យឡើងវិញ ប្រសិនបើកម្រិតភាពត្រឹមត្រូវទាបជាង {settings.aiConfidenceThreshold}%
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                គណនាពន្ធអាករស្វ័យប្រវត្តិ (VAT 10%)
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                បំបែកពន្ធអាករ 10% តាមបទប្បញ្ញត្តិពន្ធដារកម្ពុជា
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ vatEnabled: !settings.vatEnabled })}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 ${
                settings.vatEnabled ? 'bg-secondary' : 'bg-surface-container-high'
              }`}
              type="button"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.vatEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center gap-space-md mt-space-sm mb-space-lg">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-12 bg-error-container text-on-error-container hover:bg-error-container/80 rounded-xl flex items-center justify-center gap-space-xs font-label-lg text-label-lg font-bold shadow-sm transition-all active:scale-[0.99]"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>ចេញពីគណនី (Logout)</span>
        </button>
      </div>

      {/* App Version Footer Card */}
      <div className="flex flex-col items-center justify-center text-center p-space-md bg-surface-container-low/50 rounded-2xl border border-surface-container-high/40">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-1.5">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <span className="font-label-md text-label-md text-on-surface font-bold">
          សៀវភៅកត់ត្រា AI កំណែ 2.4.0
        </span>
        <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 max-w-[280px]">
          បង្កើតឡើងជាពិសេសសម្រាប់សហគ្រាស និងអាជីវកម្មនៅកម្ពុជា
        </span>
        <span className="font-label-sm text-[10px] text-on-surface-variant/70 mt-2 font-mono">
          រក្សាសិទ្ធិគ្រប់យ៉ាង © 2025 Phsar Ledger
        </span>
      </div>

      {/* Profile Edit Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-surface-container-high">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
              កែប្រែព័ត៌មានគណនី
            </h3>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  ឈ្មោះ
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-sm font-semibold outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  តួនាទី
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-sm font-semibold outline-none focus:border-secondary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm"
              >
                បោះបង់
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-semibold text-sm shadow-sm"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-surface-container-high">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">
              ជ្រើសរើសរូបិយប័ណ្ណបង្ហាញ
            </h3>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { id: 'USD_KHR', label: 'USD / KHR (បង្ហាញទាំងពីរ)', desc: 'ដុល្លារ និង រៀល' },
                { id: 'USD', label: 'USD ($ តែមួយគត់)', desc: 'ប្រាក់ដុល្លារអាមេរិក' },
                { id: 'KHR', label: 'KHR (៛ តែមួយគត់)', desc: 'ប្រាក់រៀលកម្ពុជា' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onUpdateSettings({ currency: c.id as any });
                    setShowRateModal(false);
                  }}
                  className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                    settings.currency === c.id
                      ? 'border-secondary bg-secondary-container/20 text-on-surface'
                      : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-sm block">{c.label}</span>
                    <span className="text-xs text-on-surface-variant">{c.desc}</span>
                  </div>
                  {settings.currency === c.id && (
                    <span className="material-symbols-outlined text-secondary">check</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRateModal(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm"
            >
              បិទ
            </button>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-surface-container-high">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">
              ជ្រើសរើសភាសា (Language)
            </h3>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { id: 'km', label: 'ភាសាខ្មែរ (Khmer)', desc: 'ភាសាដើម' },
                { id: 'en', label: 'English', desc: 'International' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onUpdateSettings({ language: l.id as any });
                    setShowLanguageModal(false);
                  }}
                  className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                    settings.language === l.id
                      ? 'border-secondary bg-secondary-container/20 text-on-surface'
                      : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-sm block">{l.label}</span>
                    <span className="text-xs text-on-surface-variant">{l.desc}</span>
                  </div>
                  {settings.language === l.id && (
                    <span className="material-symbols-outlined text-secondary">check</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm"
            >
              បិទ
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-surface-container-high text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              ចាកចេញពីគណនី?
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              តើអ្នកពិតជាចង់ចេញពីគណនីរបស់អ្នកមែនទេ? (Are you sure you want to log out?)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm"
              >
                បោះបង់
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-error text-white font-semibold text-sm shadow-sm"
              >
                ចេញពីគណនី
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
