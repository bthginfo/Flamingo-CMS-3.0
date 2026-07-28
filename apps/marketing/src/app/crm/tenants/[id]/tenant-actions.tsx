'use client';

import { useState, useTransition } from 'react';
import { updateTenantAction, deleteTenantAction, configureBlobAction, toggleShopAddonAction, toggleBookingAddonAction, toggleBillingAddonAction, toggleI18nAction, updateI18nSettingsAction, convertSharedToStandaloneAction, setDatabasePlanIntentAction, hardenStandaloneDatabaseRoleAction, resetTenantAdminPasswordAction } from '../actions';
import { toast } from 'sonner';
import { CalendarCheck, Power, Pause, Trash2, Eye, ShoppingBag, UserCheck, Globe, CloudUpload, ReceiptText, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TenantActions({ tenantId, currentStatus, isDemo, isLead, deploymentMode, databasePlanIntent, databaseRoleName, shopActive, bookingActive, billingActive, i18nEnabled, i18nMaxLanguages }: { tenantId: string; currentStatus: string; isDemo?: boolean; isLead?: boolean; deploymentMode?: string; databasePlanIntent?: string; databaseRoleName?: string; shopActive?: boolean; bookingActive?: boolean; billingActive?: boolean; i18nEnabled?: boolean; i18nMaxLanguages?: number }) {
  const [pending, startTransition] = useTransition();
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const router = useRouter();

  function toggleStatus() {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    startTransition(async () => {
      await updateTenantAction(tenantId, { status: newStatus as 'active' | 'suspended' });
      toast.success(`Status geändert: ${newStatus}`);
    });
  }

  function toggleDemo() {
    startTransition(async () => {
      await updateTenantAction(tenantId, { isDemo: !isDemo });
      toast.success(isDemo ? 'Demo-Flag entfernt' : 'Als Demo markiert');
    });
  }

  function toggleLead() {
    startTransition(async () => {
      await updateTenantAction(tenantId, { isLead: !isLead });
      toast.success(isLead ? 'Lead-Flag entfernt' : 'Als Lead-Seite markiert');
    });
  }

  function toggleBilling() {
    if (billingActive && !confirm('Rechnungen & Kunden deaktivieren? Vorhandene Kunden, Rechnungen und Belegarchive bleiben vollständig erhalten.')) return;
    startTransition(async () => {
      try {
        const result = await toggleBillingAddonAction(tenantId, !billingActive);
        if (!result.success) throw new Error('Die Freischaltung konnte nicht geändert werden.');
        toast.success(billingActive ? 'Rechnungen & Kunden deaktiviert – Archiv bleibt erhalten' : 'Rechnungen & Kunden aktiviert');
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Rechnungen & Kunden konnte nicht aktualisiert werden.');
      }
    });
  }

  function resetAdminPassword() {
    const password = newAdminPassword.trim();
    if (password.length < 12) {
      toast.error('Bitte mindestens 12 Zeichen eingeben.');
      return;
    }
    startTransition(async () => {
      try {
        const result = await resetTenantAdminPasswordAction(tenantId, password);
        if (!result.success) throw new Error(result.error);
        setNewAdminPassword('');
        toast.success('Admin-Passwort wurde neu gesetzt');
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Passwort konnte nicht gesetzt werden.');
      }
    });
  }

  return (
    <div className="crm-card p-5 space-y-3">
      <h3 className="font-semibold text-slate-900 text-sm">Aktionen</h3>
      <button
        onClick={toggleStatus}
        disabled={pending}
        className={`w-full ${currentStatus === 'active' ? 'crm-btn-danger' : 'crm-btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200'}`}
      >
        {currentStatus === 'active' ? <><Pause size={14} /> Suspendieren</> : <><Power size={14} /> Aktivieren</>}
      </button>
      <button
        onClick={toggleDemo}
        disabled={pending}
        className={`w-full crm-btn ${isDemo ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <Eye size={14} /> {isDemo ? 'Demo-Flag entfernen' : 'Als Demo markieren'}
      </button>
      <button
        onClick={toggleLead}
        disabled={pending}
        className={`w-full crm-btn ${isLead ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <UserCheck size={14} /> {isLead ? 'Lead-Flag entfernen' : 'Als Lead-Seite markieren'}
      </button>
      <button
        onClick={() => {
          startTransition(async () => {
            const result = await toggleShopAddonAction(tenantId, !shopActive);
            if (result.success) toast.success(shopActive ? 'Shop-Modul deaktiviert' : 'Shop-Modul aktiviert');
            router.refresh();
          });
        }}
        disabled={pending}
        className={`w-full crm-btn ${shopActive ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <ShoppingBag size={14} /> {shopActive ? 'Shop-Modul deaktivieren' : 'Shop-Modul aktivieren'}
      </button>
      <button
        onClick={() => {
          startTransition(async () => {
            const result = await toggleBookingAddonAction(tenantId, !bookingActive);
            if (result.success) toast.success(bookingActive ? 'Booking-Addon deaktiviert' : 'Booking-Addon aktiviert');
            router.refresh();
          });
        }}
        disabled={pending}
        className={`w-full crm-btn ${bookingActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <CalendarCheck size={14} /> {bookingActive ? 'Booking-Addon deaktivieren' : 'Booking-Addon aktivieren'}
      </button>
      <button
        onClick={toggleBilling}
        disabled={pending}
        aria-busy={pending}
        className={`w-full crm-btn ${billingActive ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <ReceiptText size={14} /> {billingActive ? 'Rechnungen & Kunden deaktivieren' : 'Rechnungen & Kunden aktivieren'}
      </button>
      <p className="px-1 text-xs leading-5 text-slate-500">{billingActive ? 'Aktiv. Beim Deaktivieren bleiben alle Belege und Kundendaten erhalten.' : 'Nicht aktiv. Das Modul bleibt serverseitig gesperrt.'}</p>
      {/* i18n */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await toggleI18nAction(tenantId, !i18nEnabled);
              if (result.success) toast.success(i18nEnabled ? 'i18n deaktiviert' : 'i18n aktiviert');
              router.refresh();
            });
          }}
          disabled={pending}
          className={`w-full crm-btn ${i18nEnabled ? 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
        >
          <Globe size={14} /> {i18nEnabled ? 'Mehrsprachigkeit deaktivieren' : 'Mehrsprachigkeit aktivieren'}
        </button>
        {i18nEnabled && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Max. Sprachen:</span>
            <select
              value={i18nMaxLanguages ?? 2}
              onChange={e => {
                startTransition(async () => {
                  await updateI18nSettingsAction(tenantId, { maxLanguages: Number(e.target.value) });
                  router.refresh();
                });
              }}
              className="border rounded px-2 py-1 text-xs"
            >
              {[2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <label htmlFor="tenant-admin-password-reset" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Admin-Passwort
        </label>
        <input
          id="tenant-admin-password-reset"
          type="password"
          autoComplete="new-password"
          value={newAdminPassword}
          onChange={event => setNewAdminPassword(event.target.value)}
          placeholder="Neues Passwort, mind. 12 Zeichen"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={resetAdminPassword}
          disabled={pending || newAdminPassword.trim().length < 12}
          className="w-full crm-btn bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <KeyRound size={14} /> Passwort neu setzen
        </button>
        <p className="px-1 text-xs leading-5 text-slate-500">
          Setzt den echten Tenant-Login neu und aktualisiert den verschlüsselten CRM-Merker.
        </p>
      </div>
      <button
        onClick={() => {
          if (!confirm('Tenant wirklich endgültig löschen? Alle Daten und das Vercel-Projekt werden unwiderruflich gelöscht.')) return;
          startTransition(async () => {
            const result = await deleteTenantAction(tenantId);
            if (result.success) {
              toast.success('Tenant gelöscht');
              router.push('/crm/tenants');
            } else {
              toast.error(result.error || 'Fehler beim Löschen');
            }
          });
        }}
        disabled={pending}
        className="w-full crm-btn bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200"
      >
        <Trash2 size={14} /> Löschen
      </button>
      {deploymentMode === 'standalone' && (
        <>
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await configureBlobAction(tenantId);
              if (result.success) {
                toast.success('Blob Storage erfolgreich konfiguriert');
              } else {
                toast.error(result.error || 'Fehler bei der Blob-Konfiguration');
              }
            });
          }}
          disabled={pending}
          className="w-full crm-btn bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200 border border-amber-200"
        >
          Blob Storage konfigurieren
        </button>
        <button
          onClick={() => {
            const markPaid = databasePlanIntent !== 'paid_requested';
            startTransition(async () => {
              const result = await setDatabasePlanIntentAction(tenantId, markPaid ? 'paid_requested' : 'free');
              if (result.success) {
                toast.success(markPaid ? 'Paid-Datenbank als Bedarf vorgemerkt' : 'Planung auf Neon Free zurückgesetzt');
                router.refresh();
              } else toast.error(result.error);
            });
          }}
          disabled={pending}
          className={`w-full crm-btn ${databasePlanIntent === 'paid_requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
        >
          {databasePlanIntent === 'paid_requested' ? 'Paid-DB-Vormerkung entfernen' : 'Paid-DB als Bedarf vormerken'}
        </button>
        <p className="px-1 text-xs leading-5 text-slate-500">Die Vormerkung ändert keinen Tarif und erzeugt keine Kosten. Sie kennzeichnet den Tenant für eine später separat abrechenbare Datenbank.</p>
        {!databaseRoleName?.startsWith('flamingo_app_') && (
          <button
            onClick={() => {
              if (!confirm('Runtime-Datenbankzugriff jetzt auf eine eingeschränkte Rolle umstellen? Das Standalone-Projekt wird dabei neu deployed.')) return;
              startTransition(async () => {
                const result = await hardenStandaloneDatabaseRoleAction(tenantId);
                if (result.success) {
                  toast.success(result.alreadySecure ? 'Datenbankzugriff ist bereits abgesichert' : 'Datenbankzugriff wurde abgesichert');
                  router.refresh();
                } else toast.error(result.error);
              });
            }}
            disabled={pending}
            className="w-full crm-btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          >
            Runtime-Datenbankzugriff absichern
          </button>
        )}
        </>
      )}
      {(deploymentMode === 'shared' || deploymentMode === 'lead_shared') && (
        <button
          onClick={() => {
            if (!confirm('Shared-Tenant jetzt vollständig in ein eigenes Standalone-Projekt mit eigener Datenbank umziehen? Die Quelldaten werden erst nach erfolgreicher Prüfung entfernt.')) return;
            startTransition(async () => {
              const result = await convertSharedToStandaloneAction(tenantId);
              if (result.success) {
                toast.success(result.warning || 'Tenant wurde in ein Standalone-Projekt umgezogen');
                router.refresh();
              } else {
                toast.error(result.error || 'Umzug fehlgeschlagen');
              }
            });
          }}
          disabled={pending}
          className="w-full crm-btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200"
        >
          <CloudUpload size={14} /> Zu Standalone umziehen
        </button>
      )}
    </div>
  );
}
