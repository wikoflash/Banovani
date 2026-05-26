'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { settingsSchema } from '@banovani/validation';

const TEXT_SETTINGS = [
  { key: 'store_name', label: 'Store Name' },
  { key: 'store_description', label: 'Store Description' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'whatsapp_url', label: 'WhatsApp URL' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'delivery_tbilisi_price', label: 'Tbilisi Delivery Price (₾)' },
  { key: 'delivery_regional_price', label: 'Regional Delivery Price (₾)' },
  { key: 'free_delivery_threshold', label: 'Free Delivery Threshold (₾)' },
];

const TEXTAREA_SETTINGS = [
  { key: 'size_guide', label: 'Size Guide (JSON)' },
  { key: 'return_policy', label: 'Return Policy Text' },
  { key: 'order_confirmation_message', label: 'Order Confirmation Message (Georgian)' },
];

type SettingsMap = Record<string, string>;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const map: SettingsMap = {};
        (d.settings ?? []).forEach((s: any) => {
          map[s.key] = s.value ?? '';
        });
        setSettings(map);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await res.json();
        setError(data.error ?? 'Failed to save settings');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-brand text-2xl text-[--color-deep-brown]">Settings</h1>

      {loading ? (
        <div className="text-sm text-[--color-secondary-text]">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-sm font-semibold">Store Settings</h2>
            <div className="grid gap-4">
              {TEXT_SETTINGS.map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-medium">{label}</label>
                  <Input
                    value={settings[key] ?? ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
            <h2 className="mb-4 text-sm font-semibold">Content</h2>
            <div className="grid gap-4">
              {TEXTAREA_SETTINGS.map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-medium">{label}</label>
                  <Textarea
                    value={settings[key] ?? ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={key === 'size_guide' ? 8 : 4}
                    className="font-mono text-xs"
                  />
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[--color-error]">{error}</p>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
