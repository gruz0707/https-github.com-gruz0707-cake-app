import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, KeyRound, X } from 'lucide-react';
import { BillsHistoryView } from './components/BillsHistoryView';
import { BottomTabBar } from './components/BottomTabBar';
import { CakeCatalogView } from './components/CakeCatalogView';
import { CheckoutNotice } from './components/CheckoutNotice';
import { DataBackupView } from './components/DataBackupView';
import { LicenseGateModal } from './components/LicenseGateModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PosCounterView } from './components/PosCounterView';
import { PrinterSettingsView } from './components/PrinterSettingsView';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { RevenueDashboardView } from './components/RevenueDashboardView';
import { TopNav } from './components/TopNav';
import { usePosStore } from './hooks/usePosStore';
import { getNativeDeviceInfo } from './services/nativePrinter';
import type { ActiveTab, BillOrder } from './types/pos';
import {
  evaluateLicense,
  getAppBuildTimeMs,
  getHighWatermarkMs,
  loadOrInitLicenseState,
  saveLicenseState,
  verifyLicenseKey,
  type VerifiedKeyPayload,
} from './utils/licensing';
import { createMemoryStorage, getBrowserStorage } from './utils/storage';

export default function App() {
  const store = usePosStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<BillOrder | null>(null);
  const [licenseStorage] = useState(() => getBrowserStorage() ?? createMemoryStorage());
  const [licenseState, setLicenseState] = useState(() =>
    loadOrInitLicenseState(licenseStorage),
  );
  const [verifiedKey, setVerifiedKey] = useState<VerifiedKeyPayload | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);

  // Reconcile native Android device fingerprint & install time on launch
  useEffect(() => {
    let active = true;
    void getNativeDeviceInfo().then((info) => {
      if (!active) return;
      if (info.androidId || info.firstInstallTime) {
        setLicenseState(loadOrInitLicenseState(licenseStorage, new Date(), info));
      }
    });
    return () => {
      active = false;
    };
  }, [licenseStorage]);

  // Verify any stored license key asynchronously using ECDSA P-256 public key
  useEffect(() => {
    let active = true;
    const key = licenseState.licenseKey;
    if (!key) {
      setVerifiedKey(null);
      return;
    }
    void verifyLicenseKey(key, licenseState.deviceId).then((res) => {
      if (active) setVerifiedKey(res);
    });
    return () => {
      active = false;
    };
  }, [licenseState.licenseKey, licenseState.deviceId]);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setNowTick(now.getTime());
      setLicenseState((prev) => {
        if (prev.tampered) return prev;
        const lastMs = Date.parse(prev.lastSeenAt);
        if (Number.isFinite(lastMs) && now.getTime() > lastMs) {
          return saveLicenseState(licenseStorage, {
            ...prev,
            lastSeenAt: now.toISOString(),
          });
        }
        return prev;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, [licenseStorage]);

  const { evaluation: licenseEval, newlyExpiredKey } = useMemo(
    () => evaluateLicense(licenseState, store.orders, verifiedKey, new Date(nowTick)),
    [licenseState, store.orders, verifiedKey, nowTick],
  );

  // Permanently blacklist expired timed keys so they can never be replayed
  useEffect(() => {
    if (!newlyExpiredKey) return;
    setLicenseState((prev) => {
      if (prev.expiredKeys.includes(newlyExpiredKey) && prev.licenseKey === null) return prev;
      const nextExpired = prev.expiredKeys.includes(newlyExpiredKey)
        ? prev.expiredKeys
        : [...prev.expiredKeys, newlyExpiredKey];
      return saveLicenseState(licenseStorage, {
        ...prev,
        licenseKey: null,
        expiredKeys: nextExpired,
      });
    });
  }, [newlyExpiredKey, licenseStorage]);

  const licenseLocked =
    licenseEval.status === 'expired' ||
    licenseEval.status === 'clock_tampered' ||
    licenseEval.status === 'tampered';

  const handleActivateLicense = async (
    rawKey: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanKey = rawKey.trim();
    if (licenseEval.status === 'clock_tampered') {
      return {
        ok: false,
        error: 'Restore your device date & time to automatic before activating.',
      };
    }
    if (licenseState.expiredKeys.includes(cleanKey)) {
      return {
        ok: false,
        error: 'This license key has already expired and cannot be reused.',
      };
    }
    const check = await verifyLicenseKey(cleanKey, licenseState.deviceId);
    if (!check.valid) {
      return { ok: false, error: check.error };
    }
    const nowMs = Date.now();
    const watermarkMs = getHighWatermarkMs(licenseState, store.orders, getAppBuildTimeMs());
    const effectiveNowMs = Math.max(nowMs, watermarkMs);
    if (check.expiresAt && effectiveNowMs > check.expiresAt.getTime()) {
      const nextExpired = licenseState.expiredKeys.includes(cleanKey)
        ? licenseState.expiredKeys
        : [...licenseState.expiredKeys, cleanKey];
      setLicenseState(
        saveLicenseState(licenseStorage, {
          ...licenseState,
          expiredKeys: nextExpired,
        }),
      );
      return { ok: false, error: 'This activation key has already expired.' };
    }
    const nextLastSeenIso = new Date(Math.max(effectiveNowMs, nowMs)).toISOString();
    const updated = saveLicenseState(licenseStorage, {
      deviceId: licenseState.deviceId,
      firstSeenAt: licenseState.firstSeenAt,
      lastSeenAt: nextLastSeenIso,
      licenseKey: cleanKey,
      activatedAt: new Date(nowMs).toISOString(),
      expiredKeys: licenseState.expiredKeys,
    });
    setVerifiedKey(check);
    setLicenseState(updated);
    setLicenseModalOpen(false);
    return { ok: true };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleCheckout = async () => {
    // Saves durably first, then sends the receipt. No compulsory preview.
    await store.checkoutAndPrint();
  };

  if (licenseLocked) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <LicenseGateModal
          evaluation={licenseEval}
          locked
          onActivate={handleActivateLicense}
          onExportBackup={() => {
            void store.exportBackupJson();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <TopNav
        shopName={store.settings.shopName}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        printer={store.printer}
        onOpenPrinterTab={() => setActiveTab('printer')}
      />

      {licenseEval.status === 'trial' && (
        <div className="border-b border-caramel/25 bg-caramel-tint text-caramel">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 sm:px-6">
            <p className="text-[11px] font-semibold">
              Trial mode · {licenseEval.daysLeft}{' '}
              {licenseEval.daysLeft === 1 ? 'day' : 'days'} left
            </p>
            <button
              type="button"
              onClick={() => setLicenseModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2.5 py-0.5 text-[10.5px] font-bold text-ink shadow-xs hover:bg-white"
            >
              <KeyRound className="h-3 w-3 text-berry" aria-hidden="true" />
              <span>Activate</span>
            </button>
          </div>
        </div>
      )}

      {store.storageError && (
        <div role="alert" className="border-b border-berry/25 bg-berry-tint text-berry-deep">
          <div className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 sm:px-6">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-[11px] font-semibold">{store.storageError}</p>
            <button
              type="button"
              onClick={store.dismissStorageError}
              aria-label="Dismiss storage message"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md hover:bg-white/50"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {store.checkoutNotice && (
        <CheckoutNotice
          notice={store.checkoutNotice}
          printerConnected={store.printer.status === 'connected'}
          onDismiss={store.dismissCheckoutNotice}
          onReprint={() => store.retryCheckoutNotice()}
          onViewOrder={(order) => setActiveReceiptOrder(order)}
        />
      )}

      <main className="flex-1">
        <OfflineIndicator />
        <PWAInstallBanner />
        <div key={activeTab} className="animate-view">
          {activeTab === 'pos' && (
            <PosCounterView
              cakes={store.cakes}
              cart={store.cart}
              settings={store.settings}
              discountAmount={store.discountAmount}
              onChangeDiscount={store.setDiscountAmount}
              paymentMethod={store.paymentMethod}
              onChangePaymentMethod={store.setPaymentMethod}
              customerName={store.customerName}
              onChangeCustomerName={store.setCustomerName}
              customerPhone={store.customerPhone}
              onChangeCustomerPhone={store.setCustomerPhone}
              orderNote={store.orderNote}
              onChangeOrderNote={store.setOrderNote}
              onAddConfiguredItem={store.addConfiguredItem}
              onUpdateConfiguredItem={store.updateConfiguredItem}
              onUpdateQty={store.updateCartItemQty}
              onClearCart={store.clearCart}
              onCheckout={handleCheckout}
              isCheckingOut={store.isCheckingOut}
              printerConnected={store.printer.status === 'connected'}
              printerMode={store.printer.mode}
              autoPrintOnCheckout={store.settings.autoPrintOnCheckout}
              scheduleMode={store.scheduleMode}
              onScheduleMode={store.setScheduleMode}
              fulfilmentType={store.fulfilmentType}
              onFulfilmentType={store.setFulfilmentType}
              fulfilmentDate={store.fulfilmentDate}
              onFulfilmentDate={store.setFulfilmentDate}
              fulfilmentTime={store.fulfilmentTime}
              onFulfilmentTime={store.setFulfilmentTime}
              deliveryAddress={store.deliveryAddress}
              onDeliveryAddress={store.setDeliveryAddress}
              advanceAmount={store.advanceAmount}
              onAdvanceAmount={store.setAdvanceAmount}
            />
          )}

          {activeTab === 'catalog' && (
            <CakeCatalogView
              cakes={store.cakes}
              currencySymbol={store.settings.currencySymbol}
              catalogMeta={store.catalogMeta}
              onSaveCake={store.saveCake}
              onToggleStock={store.toggleCakeStock}
              onDeleteCake={store.deleteCake}
            />
          )}

          {activeTab === 'orders' && (
            <BillsHistoryView
              store={store}
              onSelectOrder={(order) => setActiveReceiptOrder(order)}
            />
          )}


          {activeTab === 'dashboard' && (
            <RevenueDashboardView
              orders={store.orders}
              settings={store.settings}
              onGoToCounter={() => setActiveTab('pos')}
            />
          )}

          {activeTab === 'data' && <DataBackupView store={store} />}

          {activeTab === 'printer' && (
            <PrinterSettingsView
              printer={store.printer}
              rememberedPrinter={store.rememberedPrinter}
              settings={store.settings}
              lastPrintLog={store.lastPrintLog}
              onScanNative={store.scanNative}
              onConnectNative={store.connectNativeDevice}
              onConnectWebBluetooth={store.connectWebBluetooth}
              onReconnectRemembered={store.reconnectRemembered}
              onConnectSimulated={store.connectSimulatedPrinter}
              onDisconnectPrinter={store.disconnectPrinter}
              onForgetPrinter={store.forgetRememberedPrinter}
              onPrintTestSlip={store.printTestSlip}
              onUpdateSettings={store.updateSettings}
            />
          )}
        </div>
      </main>

      <BottomTabBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        printerConnected={store.printer.status === 'connected'}
      />

      {activeReceiptOrder && (
        <ReceiptPreviewModal
          order={activeReceiptOrder}
          settings={store.settings}
          printer={store.printer}
          onClose={() => setActiveReceiptOrder(null)}
          onPrintBluetooth={store.printOrder}
          onPrintKitchenTicket={store.printKitchenTicket}
          onBrowserPrint={store.markOrderBrowserPrinted}
          onOpenPrinterSetup={() => {
            setActiveReceiptOrder(null);
            setActiveTab('printer');
          }}
        />
      )}
      {(licenseLocked || licenseModalOpen) && (
        <LicenseGateModal
          evaluation={licenseEval}
          locked={licenseLocked}
          onActivate={handleActivateLicense}
          onExportBackup={() => {
            void store.exportBackupJson();
          }}
          onClose={licenseLocked ? undefined : () => setLicenseModalOpen(false)}
        />
      )}
    </div>
  );
}
