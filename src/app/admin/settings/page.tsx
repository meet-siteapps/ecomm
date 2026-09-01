'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Truck,
  Percent,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw,
  Sparkles,
  Banknote
} from 'lucide-react';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '@/frontend/types/settings';
import { getStoreSettings, updateStoreSettings } from '@/backend/services/settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getStoreSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load store settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await updateStoreSettings({
        store_name: settings.store_name.trim(),
        tagline: settings.tagline?.trim(),
        contact_email: settings.contact_email.trim(),
        contact_phone: settings.contact_phone.trim(),
        store_address: settings.store_address.trim(),
        shipping_fee: Number(settings.shipping_fee) || 0,
        free_shipping_threshold: Number(settings.free_shipping_threshold) || 0,
        tax_percentage: Number(settings.tax_percentage) || 0,
        currency_symbol: settings.currency_symbol || '₹',
        is_cod_enabled: settings.is_cod_enabled,
      });

      setSettings(updated);
      setFeedback({ type: 'success', message: 'Store settings saved successfully to Supabase!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
        <p className="text-xs text-gray-500 font-medium">Loading store settings from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store name, contact details, shipping charges, and taxes saved in Supabase
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={isLoading || isSaving}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          title="Reload from Supabase"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Store Brand & Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Store className="w-4 h-4 text-[#4DA3FF]" />
            <span>1. Store Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Store Name *</label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                placeholder="e.g. Baby Ladoo"
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Tagline / Subtitle</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="e.g. Premium baby clothing & essentials"
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Mail className="w-4 h-4 text-[#4DA3FF]" />
            <span>2. Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Support Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="support@babyladoo.com"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Support Phone *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Store / Business Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.store_address}
                  onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                  placeholder="e.g. 101 Fashion Hub, SG Highway, Ahmedabad, Gujarat"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Shipping & Delivery Charges */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="w-4 h-4 text-[#4DA3FF]" />
            <span>3. Shipping Charges</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Standard Shipping Fee (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
              <span className="text-[11px] text-gray-400 block">
                Charged when order subtotal is below the free shipping threshold.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Free Shipping Minimum Threshold (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                }
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
              <span className="text-[11px] text-gray-400 block">
                Orders equal or above this amount automatically receive FREE Delivery.
              </span>
            </div>
          </div>
        </div>

        {/* 4. Basic Tax & Store Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Percent className="w-4 h-4 text-[#4DA3FF]" />
            <span>4. Basic Tax & Payment Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Tax / GST Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.tax_percentage}
                onChange={(e) => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
              <span className="text-[11px] text-gray-400 block">Set to 0 if prices are tax-inclusive.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
              />
              <span className="text-[11px] text-gray-400 block">Default currency symbol (e.g. ₹).</span>
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.is_cod_enabled}
                  onChange={(e) => setSettings({ ...settings, is_cod_enabled: e.target.checked })}
                  className="w-4 h-4 text-[#4DA3FF] rounded-md focus:ring-[#4DA3FF]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1F2937] block">
                    Allow Cash on Delivery (COD) Checkout
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Allow customers to place orders with payment due upon delivery.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
