import { useState } from 'react';
import { BillsHistoryView } from './components/BillsHistoryView';
import { BottomTabBar } from './components/BottomTabBar';
import { CakeCatalogView } from './components/CakeCatalogView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PosCounterView } from './components/PosCounterView';
import { PrinterSettingsView } from './components/PrinterSettingsView';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { RevenueDashboardView } from './components/RevenueDashboardView';
import { TopNav } from './components/TopNav';
import { usePosStore } from './hooks/usePosStore';
import type { ActiveTab, BillOrder } from './types/pos';
import { formatReceiptLines } from './utils/escpos';

export default function App() {
  const store = usePosStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<BillOrder | null>(null);

  const handleCheckout = async () => {
    const created = store.checkoutOrder();
    if (!created) return;

    if (store.settings.autoPrintOnCheckout && store.printer.status === 'connected') {
      const escPosLines = formatReceiptLines(created, store.settings, true);
      const printRes = await store.printOrderViaBluetooth(created, escPosLines);
      if (printRes.ok) {
        setActiveReceiptOrder({
          ...created,
          printedAt: new Date().toISOString(),
          printMode: printRes.mode,
        });
        return;
      }
    }

    setActiveReceiptOrder(created);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopNav
        shopName={store.settings.shopName}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        printer={store.printer}
        onOpenPrinterTab={() => setActiveTab('printer')}
      />

      <main className="flex-1">
        <OfflineIndicator />
        <PWAInstallBanner />
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
            onAddToCart={store.addToCart}
            onUpdateQty={store.updateCartItemQty}
            onToggleEggless={store.toggleCartItemEggless}
            onUpdateItemMessage={store.updateCartItemMessage}
            onClearCart={store.clearCart}
            onCheckout={handleCheckout}
            printerConnected={store.printer.status === 'connected'}
          />
        )}

        {activeTab === 'catalog' && (
          <CakeCatalogView
            cakes={store.cakes}
            currencySymbol={store.settings.currencySymbol}
            onSaveCake={store.saveCake}
            onToggleStock={store.toggleCakeStock}
            onDeleteCake={store.deleteCake}
          />
        )}

        {activeTab === 'orders' && (
          <BillsHistoryView
            orders={store.orders}
            settings={store.settings}
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

        {activeTab === 'printer' && (
          <PrinterSettingsView
            printer={store.printer}
            settings={store.settings}
            lastPrintLog={store.lastPrintLog}
            onConnectBluetooth={store.connectRealBluetooth}
            onConnectSimulated={store.connectSimulatedPrinter}
            onDisconnectPrinter={store.disconnectPrinter}
            onPrintTestSlip={store.printTestSlip}
            onUpdateSettings={store.updateSettings}
          />
        )}
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
          onPrintBluetooth={store.printOrderViaBluetooth}
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
