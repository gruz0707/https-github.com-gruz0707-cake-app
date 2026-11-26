import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BillsHistoryView } from './components/BillsHistoryView';
import { BottomTabBar } from './components/BottomTabBar';
import { CakeCatalogView } from './components/CakeCatalogView';
import { CheckoutNotice } from './components/CheckoutNotice';
import { DataBackupView } from './components/DataBackupView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PosCounterView } from './components/PosCounterView';
import { PrinterSettingsView } from './components/PrinterSettingsView';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { RevenueDashboardView } from './components/RevenueDashboardView';
import { TopNav } from './components/TopNav';
import { usePosStore } from './hooks/usePosStore';
import type { ActiveTab, BillOrder } from './types/pos';

export default function App() {
  const store = usePosStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<BillOrder | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleCheckout = async () => {
    // Saves durably first, then sends the receipt. No compulsory preview.
    await store.checkoutAndPrint();
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <TopNav
        shopName={store.settings.shopName}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        printer={store.printer}
        onOpenPrinterTab={() => setActiveTab('printer')}
      />

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
    </div>
  );
}
