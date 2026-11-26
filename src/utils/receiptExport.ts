import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { BillOrder, CartItem, ShopSettings } from '../types/pos';
import { formatCurrency } from './billing';
import { orderAdvance, orderBalance } from './orders';

export const STORE_WEBSITE_URL = 'https://www.esaicakes.in/';

export function getUpiPayAmount(order: BillOrder): number {
  const balance = orderBalance(order);
  const advance = orderAdvance(order);
  if (advance > 0 && balance > 0) return balance;
  return order.total;
}

export function shouldShowUpiQr(order: BillOrder, settings: ShopSettings): boolean {
  if (!settings.upiId?.trim()) return false;
  const balance = orderBalance(order);
  return order.paymentMethod === 'UPI' || balance > 0;
}

export function buildUpiPayUri(
  upiId: string,
  shopName: string,
  amount: number,
  billNumber: string,
): string {
  const params = new URLSearchParams({
    pa: upiId.trim(),
    pn: shopName.trim() || 'Esai Cakes',
    am: amount.toFixed(2),
    cu: 'INR',
    tn: `Bill ${billNumber}`,
  });
  return `upi://pay?${params.toString()}`;
}

function itemWeightSummary(item: CartItem): string {
  const kg = item.weightKg >= 1 ? `${item.weightKg} kg` : `${Math.round(item.weightKg * 1000)}g`;
  const extras: string[] = [];
  if (item.flavour) extras.push(item.flavour);
  if (item.eggless) extras.push('Eggless');
  return `${[kg, ...extras].join(' · ')} × ${item.quantity}`;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function makeQrCanvas(value: string, sizePx: number): Promise<HTMLCanvasElement> {
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, value, {
    width: sizePx,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#111111',
      light: '#ffffff',
    },
  });
  return qrCanvas;
}

function drawCakeIcon(ctx: CanvasRenderingContext2D, centerX: number, topY: number): void {
  ctx.save();
  ctx.translate(centerX - 26, topY);
  ctx.strokeStyle = '#111111';
  ctx.fillStyle = '#111111';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Plate
  ctx.beginPath();
  ctx.ellipse(26, 38, 22, 4, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Cake body
  ctx.beginPath();
  ctx.roundRect(7, 22, 38, 16, 3);
  ctx.stroke();

  // Frosting wave
  ctx.beginPath();
  ctx.moveTo(7, 25);
  ctx.quadraticCurveTo(12, 21, 17, 25);
  ctx.quadraticCurveTo(22, 29, 27, 25);
  ctx.quadraticCurveTo(32, 21, 37, 25);
  ctx.quadraticCurveTo(42, 29, 45, 25);
  ctx.stroke();

  // Candles
  ctx.beginPath();
  ctx.roundRect(17, 13, 4, 9, 1);
  ctx.roundRect(31, 13, 4, 9, 1);
  ctx.stroke();

  // Flames
  ctx.beginPath();
  ctx.ellipse(19, 11, 1.8, 2.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(33, 11, 1.8, 2.3, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Cherry
  ctx.beginPath();
  ctx.arc(26, 19, 2.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(26, 16.5);
  ctx.lineTo(26, 13);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(26, 13, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export async function renderReceiptCanvas(
  order: BillOrder,
  settings: ShopSettings,
): Promise<HTMLCanvasElement> {
  const scale = 2;
  const width = 340;
  const padX = 22;
  const contentWidth = width - padX * 2;
  const fontStack = '"Helvetica Neue", Helvetica, Arial, sans-serif';

  const curr = settings.currencySymbol === '₹' ? 'Rs. ' : settings.currencySymbol;
  const fmt = (n: number) => formatCurrency(n, curr);

  const dt = new Date(order.createdAt);
  const dateStr = dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = dt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const showUpi = shouldShowUpiQr(order, settings);
  const upiAmount = getUpiPayAmount(order);
  const upiQrCanvas = showUpi
    ? await makeQrCanvas(
        buildUpiPayUri(settings.upiId!, settings.shopName, upiAmount, order.billNumber),
        96 * scale,
      )
    : null;
  const siteQrCanvas = await makeQrCanvas(STORE_WEBSITE_URL, 96 * scale);

  // Use a scratch canvas to measure wrapped lines and compute exact height.
  const scratch = document.createElement('canvas');
  const sCtx = scratch.getContext('2d')!;

  const measureAndDraw = (draw: boolean, targetCtx: CanvasRenderingContext2D): number => {
    let y = 20;

    // Cake icon
    if (draw) drawCakeIcon(targetCtx, width / 2, y);
    y += 50;

    // Shop name
    targetCtx.font = `900 22px ${fontStack}`;
    targetCtx.fillStyle = '#111111';
    targetCtx.textAlign = 'center';
    if (draw) targetCtx.fillText(settings.shopName.toUpperCase(), width / 2, y + 18);
    y += 24;

    if (settings.tagline.trim()) {
      targetCtx.font = `italic 11px ${fontStack}`;
      targetCtx.fillStyle = '#4b5563';
      for (const line of wrapCanvasText(targetCtx, settings.tagline, contentWidth)) {
        if (draw) targetCtx.fillText(line, width / 2, y + 10);
        y += 14;
      }
    }

    if (settings.address.trim()) {
      targetCtx.font = `400 10.5px ${fontStack}`;
      targetCtx.fillStyle = '#374151';
      for (const line of wrapCanvasText(targetCtx, settings.address, contentWidth)) {
        if (draw) targetCtx.fillText(line, width / 2, y + 10);
        y += 14;
      }
    }

    if (settings.phone.trim()) {
      targetCtx.font = `400 10.5px ${fontStack}`;
      targetCtx.fillStyle = '#374151';
      if (draw) targetCtx.fillText(`Phone: ${settings.phone}`, width / 2, y + 10);
      y += 15;
    }

    y += 8;
    if (draw) {
      targetCtx.strokeStyle = '#111111';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
    }
    y += 12;

    // Bill metadata
    targetCtx.textAlign = 'left';
    targetCtx.fillStyle = '#111111';
    targetCtx.font = `400 10.5px ${fontStack}`;
    if (draw) targetCtx.fillText(`Bill: ${order.billNumber}`, padX, y + 9);
    y += 15;
    if (draw) targetCtx.fillText(`Date: ${dateStr}  ${timeStr}`, padX, y + 9);
    y += 15;

    if (order.customerName?.trim()) {
      if (draw) targetCtx.fillText(`Customer: ${order.customerName.trim()}`, padX, y + 9);
      y += 15;
    }
    if (order.customerPhone?.trim()) {
      if (draw) targetCtx.fillText(`Phone: ${order.customerPhone.trim()}`, padX, y + 9);
      y += 15;
    }

    y += 4;
    if (draw) {
      targetCtx.strokeStyle = '#111111';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
    }
    y += 10;

    // Item / Amt column header
    targetCtx.font = `700 9.5px ${fontStack}`;
    targetCtx.fillStyle = '#4b5563';
    targetCtx.textAlign = 'left';
    if (draw) targetCtx.fillText('ITEM', padX, y + 8);
    targetCtx.textAlign = 'right';
    if (draw) targetCtx.fillText('AMT', width - padX, y + 8);
    y += 14;
    if (draw) {
      targetCtx.save();
      targetCtx.setLineDash([4, 3]);
      targetCtx.strokeStyle = '#9ca3af';
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
      targetCtx.restore();
    }
    y += 12;

    // Items
    for (const item of order.items) {
      const lineTotal = fmt(item.unitPrice * item.quantity);
      targetCtx.font = `700 11.5px ${fontStack}`;
      targetCtx.fillStyle = '#111111';
      targetCtx.textAlign = 'right';
      const priceWidth = targetCtx.measureText(lineTotal).width + 10;
      const nameLines = wrapCanvasText(targetCtx, item.cakeName, contentWidth - priceWidth);

      if (draw) {
        targetCtx.fillText(lineTotal, width - padX, y + 10);
      }
      targetCtx.textAlign = 'left';
      for (const nLine of nameLines) {
        if (draw) targetCtx.fillText(nLine, padX, y + 10);
        y += 14;
      }

      targetCtx.font = `400 10px ${fontStack}`;
      targetCtx.fillStyle = '#4b5563';
      if (draw) targetCtx.fillText(itemWeightSummary(item), padX, y + 9);
      y += 14;

      if (item.cakeMessage?.trim()) {
        targetCtx.font = `italic 9.5px ${fontStack}`;
        targetCtx.fillStyle = '#6b7280';
        for (const msgLine of wrapCanvasText(targetCtx, `"${item.cakeMessage.trim()}"`, contentWidth)) {
          if (draw) targetCtx.fillText(msgLine, padX, y + 9);
          y += 13;
        }
      }

      if (item.notes?.trim()) {
        targetCtx.font = `400 9.5px ${fontStack}`;
        targetCtx.fillStyle = '#6b7280';
        for (const noteLine of wrapCanvasText(targetCtx, `Note: ${item.notes.trim()}`, contentWidth)) {
          if (draw) targetCtx.fillText(noteLine, padX, y + 9);
          y += 13;
        }
      }
      y += 6;
    }

    // Dashed totals separator
    if (draw) {
      targetCtx.save();
      targetCtx.setLineDash([4, 3]);
      targetCtx.strokeStyle = '#9ca3af';
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
      targetCtx.restore();
    }
    y += 12;

    const drawSummaryRow = (label: string, val: string, bold = false) => {
      targetCtx.font = `${bold ? '700' : '400'} 10.5px ${fontStack}`;
      targetCtx.fillStyle = bold ? '#111111' : '#374151';
      targetCtx.textAlign = 'left';
      if (draw) targetCtx.fillText(label, padX, y + 9);
      targetCtx.textAlign = 'right';
      if (draw) targetCtx.fillText(val, width - padX, y + 9);
      y += 15;
    };

    drawSummaryRow('Subtotal', fmt(order.subtotal));
    drawSummaryRow(
      'Discount',
      order.discountAmount > 0 ? `-${fmt(order.discountAmount)}` : fmt(0),
    );
    if (order.taxRate > 0) {
      drawSummaryRow(`Tax (${order.taxRate}%)`, fmt(order.taxAmount));
    }

    y += 4;
    if (draw) {
      targetCtx.strokeStyle = '#111111';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
    }
    y += 12;

    // TOTAL row
    targetCtx.fillStyle = '#111111';
    targetCtx.font = `900 16px ${fontStack}`;
    targetCtx.textAlign = 'left';
    if (draw) targetCtx.fillText('TOTAL', padX, y + 14);
    targetCtx.font = `900 18px ${fontStack}`;
    targetCtx.textAlign = 'right';
    if (draw) targetCtx.fillText(fmt(order.total), width - padX, y + 14);
    y += 22;

    targetCtx.font = `400 10px ${fontStack}`;
    targetCtx.fillStyle = '#4b5563';
    targetCtx.textAlign = 'left';
    if (draw) targetCtx.fillText(`Payment: ${order.paymentMethod}`, padX, y + 9);
    y += 15;

    const advance = orderAdvance(order);
    const balance = orderBalance(order);
    if (advance > 0 && balance > 0) {
      drawSummaryRow('Advance paid', fmt(advance));
      drawSummaryRow('Balance due', fmt(balance), true);
    }

    y += 8;

    // Optional Dynamic UPI Payment QR
    if (upiQrCanvas) {
      if (draw) {
        targetCtx.strokeStyle = '#111111';
        targetCtx.lineWidth = 1;
        targetCtx.beginPath();
        targetCtx.moveTo(padX, y);
        targetCtx.lineTo(width - padX, y);
        targetCtx.stroke();
      }
      y += 12;
      if (draw) {
        targetCtx.drawImage(upiQrCanvas, (width - 96) / 2, y, 96, 96);
      }
      y += 104;
      targetCtx.textAlign = 'center';
      targetCtx.font = `900 11px ${fontStack}`;
      targetCtx.fillStyle = '#111111';
      if (draw) targetCtx.fillText(`SCAN TO PAY · ${fmt(upiAmount)}`, width / 2, y + 9);
      y += 14;
      targetCtx.font = `400 9.5px ${fontStack}`;
      targetCtx.fillStyle = '#4b5563';
      if (draw) targetCtx.fillText(`UPI: ${settings.upiId}`, width / 2, y + 9);
      y += 18;
    }

    // Website QR
    if (draw) {
      targetCtx.strokeStyle = '#111111';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
    }
    y += 12;
    if (draw) {
      targetCtx.drawImage(siteQrCanvas, (width - 96) / 2, y, 96, 96);
    }
    y += 104;
    targetCtx.textAlign = 'center';
    targetCtx.font = `900 11px ${fontStack}`;
    targetCtx.fillStyle = '#111111';
    if (draw) targetCtx.fillText('SCAN TO EXPLORE OUR CAKES', width / 2, y + 9);
    y += 14;
    targetCtx.font = `400 9.5px ${fontStack}`;
    targetCtx.fillStyle = '#4b5563';
    if (draw) targetCtx.fillText('Order again on our website', width / 2, y + 9);
    y += 18;

    // Footer
    if (draw) {
      targetCtx.strokeStyle = '#111111';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(padX, y);
      targetCtx.lineTo(width - padX, y);
      targetCtx.stroke();
    }
    y += 12;

    const footerLines = settings.receiptFooter.trim()
      ? wrapCanvasText(targetCtx, settings.receiptFooter, contentWidth)
      : [`Thank you for choosing ${settings.shopName}!`, 'Freshly baked with love'];

    targetCtx.font = `italic 10px ${fontStack}`;
    targetCtx.fillStyle = '#4b5563';
    targetCtx.textAlign = 'center';
    for (const fLine of footerLines) {
      if (draw) targetCtx.fillText(fLine, width / 2, y + 9);
      y += 14;
    }

    return y + 16;
  };

  const totalHeight = measureAndDraw(false, sCtx);
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, totalHeight);
  measureAndDraw(true, ctx);
  return canvas;
}

export interface ExportOutcome {
  ok: boolean;
  method?: 'share' | 'download';
  filename: string;
  error?: string;
}

async function deliverBinaryFile(
  blob: Blob,
  filename: string,
  title: string,
): Promise<ExportOutcome> {
  try {
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    if (nav && typeof nav.share === 'function' && typeof File !== 'undefined') {
      const file = new File([blob], filename, { type: blob.type });
      const shareData: ShareData = { files: [file], title };
      const canShare =
        typeof nav.canShare === 'function' ? nav.canShare(shareData) : true;
      if (canShare) {
        try {
          await nav.share(shareData);
          return { ok: true, method: 'share', filename };
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            return { ok: true, method: 'share', filename };
          }
          // Fall through to direct download when native share rejects.
        }
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
    return { ok: true, method: 'download', filename };
  } catch (err) {
    return {
      ok: false,
      filename,
      error: err instanceof Error ? err.message : 'Could not export receipt.',
    };
  }
}

export async function exportReceiptPng(
  order: BillOrder,
  settings: ShopSettings,
): Promise<ExportOutcome> {
  const filename = `${order.billNumber}.png`;
  const canvas = await renderReceiptCanvas(order, settings);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) {
    return { ok: false, filename, error: 'Failed to generate receipt image.' };
  }
  return deliverBinaryFile(blob, filename, `${settings.shopName} Bill ${order.billNumber}`);
}

export async function exportReceiptPdf(
  order: BillOrder,
  settings: ShopSettings,
): Promise<ExportOutcome> {
  const filename = `${order.billNumber}.pdf`;
  const canvas = await renderReceiptCanvas(order, settings);
  const imgData = canvas.toDataURL('image/png');
  const pageWidthMm = settings.paperWidth === 58 ? 58 : 80;
  const pageHeightMm = Math.max(80, (canvas.height / canvas.width) * pageWidthMm);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidthMm, pageHeightMm],
  });
  doc.addImage(imgData, 'PNG', 0, 0, pageWidthMm, pageHeightMm);
  const blob = doc.output('blob');
  return deliverBinaryFile(blob, filename, `${settings.shopName} Bill ${order.billNumber}`);
}
