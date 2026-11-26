import type { BillOrder, CartItem, ShopSettings } from '../types/pos';
import { formatCurrency } from './billing';
import { cartItemWeightLabel } from './pricing';
import { formatDueLabel, orderAdvance, orderBalance, orderStatus } from './orders';

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

export const ESC_POS_COMMANDS = {
  INIT: [ESC, 0x40],
  ALIGN_LEFT: [ESC, 0x61, 0x00],
  ALIGN_CENTER: [ESC, 0x61, 0x01],
  ALIGN_RIGHT: [ESC, 0x61, 0x02],
  BOLD_ON: [ESC, 0x45, 0x01],
  BOLD_OFF: [ESC, 0x45, 0x00],
  SIZE_NORMAL: [GS, 0x21, 0x00],
  SIZE_DOUBLE_HEIGHT: [GS, 0x21, 0x01],
  SIZE_DOUBLE_BOTH: [GS, 0x21, 0x11],
  FEED_AND_PARTIAL_CUT: [ESC, 0x64, 0x04, GS, 0x56, 0x42, 0x00],
} as const;

export function getColumnsForWidth(paperWidth: 58 | 80): number {
  return paperWidth === 80 ? 48 : 32;
}

export function padLeftRight(left: string, right: string, width: number): string {
  const cleanLeft = left.trim();
  const cleanRight = right.trim();
  if (cleanLeft.length + cleanRight.length + 1 <= width) {
    const spaces = width - cleanLeft.length - cleanRight.length;
    return `${cleanLeft}${' '.repeat(spaces)}${cleanRight}`;
  }
  const maxLeft = Math.max(4, width - cleanRight.length - 1);
  const truncatedLeft = cleanLeft.slice(0, maxLeft);
  const spaces = Math.max(1, width - truncatedLeft.length - cleanRight.length);
  return `${truncatedLeft}${' '.repeat(spaces)}${cleanRight}`;
}

export function wrapText(text: string, width: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word.slice(0, width);
    } else if (current.length + 1 + word.length <= width) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word.slice(0, width);
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function centerText(text: string, width: number): string {
  const trimmed = text.trim().slice(0, width);
  const leftPad = Math.max(0, Math.floor((width - trimmed.length) / 2));
  return `${' '.repeat(leftPad)}${trimmed}`;
}

function sanitizeAscii(text: string, currencySymbol: string): string {
  // Normalize accented Latin letters and map the rupee symbol to ASCII.
  // Tamil and other non-ASCII characters are intentionally replaced only at
  // byte-encoding time and reported to the operator (see encoding warnings).
  const normalized = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return normalized
    .replaceAll('₹', currencySymbol === '₹' ? 'Rs.' : currencySymbol)
    .replaceAll('·', '-')
    .replace(/[^\x20-\x7E]/g, ' ');
}

function itemMeta(item: CartItem): string {
  const parts: string[] = [cartItemWeightLabel(item)];
  if (item.flavour) parts.push(item.flavour);
  if (item.eggless) parts.push('Eggless');
  return parts.join(' · ');
}

export function formatReceiptLines(order: BillOrder, shop: ShopSettings, asciiSafe = false): string[] {
  const cols = getColumnsForWidth(shop.paperWidth);
  const divider = '-'.repeat(cols);
  const doubleDivider = '='.repeat(cols);
  const curr = asciiSafe && shop.currencySymbol === '₹' ? 'Rs.' : shop.currencySymbol;
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

  const lines: string[] = [];
  lines.push(centerText(shop.shopName.toUpperCase(), cols));
  if (shop.tagline.trim()) {
    for (const l of wrapText(shop.tagline, cols)) {
      lines.push(centerText(l, cols));
    }
  }
  if (shop.address.trim()) {
    for (const l of wrapText(shop.address, cols)) {
      lines.push(centerText(l, cols));
    }
  }
  if (shop.phone.trim()) {
    lines.push(centerText(`Tel: ${shop.phone.trim()}`, cols));
  }
  if (shop.taxId.trim()) {
    lines.push(centerText(`GSTIN: ${shop.taxId.trim()}`, cols));
  }

  lines.push(doubleDivider);
  lines.push(`Bill: ${order.billNumber}`);
  lines.push(`Date: ${dateStr}  ${timeStr}`);
  lines.push(`Pay:  ${order.paymentMethod}`);

  if (order.customerName?.trim()) {
    lines.push(`Cust: ${order.customerName.trim().slice(0, cols - 6)}`);
  }
  if (order.customerPhone?.trim()) {
    lines.push(`Ph: ${order.customerPhone.trim().slice(0, cols - 4)}`);
  }
  if (order.fulfilment) {
    lines.push(
      padLeftRight(
        order.fulfilment.type === 'delivery' ? 'DELIVERY' : 'PICKUP',
        formatDueLabel(order),
        cols,
      ),
    );
    if (order.fulfilment.type === 'delivery' && order.fulfilment.address) {
      for (const addrLine of wrapText(order.fulfilment.address, cols)) {
        lines.push(addrLine);
      }
    }
  }
  if (orderStatus(order) !== 'completed') {
    lines.push(`Status: ${orderStatus(order).toUpperCase()}`);
  }

  lines.push(divider);
  lines.push(padLeftRight('ITEM', 'AMT', cols));
  lines.push(divider);

  for (const item of order.items) {
    const lineTotal = fmt(item.unitPrice * item.quantity);
    for (const t of wrapText(item.cakeName, cols)) {
      lines.push(t);
    }
    for (const metaLine of wrapText(itemMeta(item), cols - 2)) {
      lines.push(`  ${metaLine}`);
    }
    const qtyDetail = `  ${item.quantity} x ${fmt(item.unitPrice)}`;
    lines.push(padLeftRight(qtyDetail, lineTotal, cols));

    if (item.cakeMessage?.trim()) {
      for (const msgLine of wrapText(`Msg: "${item.cakeMessage.trim()}"`, cols - 2)) {
        lines.push(`  ${msgLine}`);
      }
    }
    if (item.notes?.trim()) {
      for (const noteLine of wrapText(`Note: ${item.notes.trim()}`, cols - 2)) {
        lines.push(`  ${noteLine}`);
      }
    }
  }

  lines.push(divider);
  lines.push(padLeftRight('Subtotal', fmt(order.subtotal), cols));

  if (order.discountAmount > 0) {
    lines.push(padLeftRight('Discount', `-${fmt(order.discountAmount)}`, cols));
  } else {
    lines.push(padLeftRight('Discount', fmt(0), cols));
  }

  if (order.taxRate > 0) {
    lines.push(padLeftRight(`Tax (${order.taxRate}%)`, fmt(order.taxAmount), cols));
  }

  lines.push(divider);
  lines.push(padLeftRight('TOTAL', fmt(order.total), cols));
  lines.push(padLeftRight(`Payment: ${order.paymentMethod}`, '', cols).trimEnd());
  const advance = orderAdvance(order);
  const balance = orderBalance(order);
  if (advance > 0 && balance > 0) {
    lines.push(padLeftRight('Advance paid', fmt(advance), cols));
    lines.push(padLeftRight('BALANCE DUE', fmt(balance), cols));
  } else if (advance > 0 && order.fulfilment) {
    lines.push(padLeftRight('Paid in full', fmt(advance), cols));
  }
  lines.push(divider);

  if (order.orderNote?.trim()) {
    for (const n of wrapText(`Note: ${order.orderNote.trim()}`, cols)) {
      lines.push(n);
    }
    lines.push(divider);
  }

  if (shop.receiptFooter.trim()) {
    for (const f of wrapText(shop.receiptFooter, cols)) {
      lines.push(centerText(f, cols));
    }
  } else {
    lines.push(centerText(`Thank you for choosing ${shop.shopName}!`, cols));
    lines.push(centerText('Freshly baked with love', cols));
  }

  lines.push('');
  lines.push(centerText('Order again: www.esaicakes.in', cols));
  lines.push(centerText('Bill once, retain this receipt.', cols));

  return asciiSafe ? lines.map((line) => sanitizeAscii(line, shop.currencySymbol)) : lines;
}

/**
 * ESC/POS ASCII encoders cannot print Tamil. Report it instead of silently
 * stripping text and pretending the physical receipt is complete.
 */
export function getReceiptEncodingWarnings(order: BillOrder, shop: ShopSettings): string[] {
  const lines = formatReceiptLines(order, shop, false);
  // ₹ and typographic punctuation are deliberately mapped by sanitizeAscii.
  // Only warn for scripts (Tamil and other Indic/Asian scripts) that this
  // ESC/POS ASCII path cannot represent at all.
  const hasUnsupportedScript = lines.some((line) =>
    /[\u0900-\u0DFF\u0E00-\u0E7F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(line),
  );
  return hasUnsupportedScript
    ? [
        'Receipt text contains an Indic or other non-Latin script (e.g. Tamil). ESC/POS ASCII output will replace it with spaces; verify the paper or use a raster-capable printer path.',
      ]
    : [];
}

function encodeAsciiText(text: string): number[] {
  const clean = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 1) {
    const code = clean.charCodeAt(i);
    bytes.push(code >= 0x20 && code <= 0x7e ? code : 0x20);
  }
  return bytes;
}

export function encodeEscPosReceipt(order: BillOrder, shop: ShopSettings): Uint8Array {
  const lines = formatReceiptLines(order, shop, true);
  const cols = getColumnsForWidth(shop.paperWidth);
  const out: number[] = [];

  out.push(...ESC_POS_COMMANDS.INIT);

  if (lines.length > 0) {
    out.push(...ESC_POS_COMMANDS.ALIGN_CENTER);
    out.push(...ESC_POS_COMMANDS.BOLD_ON);
    out.push(...ESC_POS_COMMANDS.SIZE_DOUBLE_HEIGHT);
    out.push(...encodeAsciiText(shop.shopName.trim().toUpperCase().slice(0, cols)), LF);
    out.push(...ESC_POS_COMMANDS.SIZE_NORMAL);
    out.push(...ESC_POS_COMMANDS.BOLD_OFF);
  }

  out.push(...ESC_POS_COMMANDS.ALIGN_LEFT);

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const isGrandTotal = line.startsWith('TOTAL');
    if (isGrandTotal) {
      out.push(...ESC_POS_COMMANDS.BOLD_ON);
      out.push(...ESC_POS_COMMANDS.SIZE_DOUBLE_HEIGHT);
      out.push(...encodeAsciiText(line), LF);
      out.push(...ESC_POS_COMMANDS.SIZE_NORMAL);
      out.push(...ESC_POS_COMMANDS.BOLD_OFF);
    } else {
      out.push(...encodeAsciiText(line), LF);
    }
  }

  out.push(...ESC_POS_COMMANDS.FEED_AND_PARTIAL_CUT);
  return new Uint8Array(out);
}

export function formatTestSlipLines(shop: ShopSettings): string[] {
  const cols = getColumnsForWidth(shop.paperWidth);
  const divider = '-'.repeat(cols);
  return [
    centerText(shop.shopName.toUpperCase(), cols),
    centerText('BLUETOOTH PRINTER TEST SLIP', cols),
    divider,
    padLeftRight('Paper Width', `${shop.paperWidth}mm (${cols} cols)`, cols),
    padLeftRight('Encoding', 'ESC/POS Binary', cols),
    padLeftRight('Status', 'READY TO BILL', cols),
    divider,
    centerText('1234567890 ABCDEFGHIJ', cols),
    centerText('Thank you for baking with us!', cols),
  ];
}

export function encodeTestSlip(shop: ShopSettings): Uint8Array {
  const lines = formatTestSlipLines(shop);
  const out: number[] = [...ESC_POS_COMMANDS.INIT, ...ESC_POS_COMMANDS.ALIGN_LEFT];
  for (let i = 0; i < lines.length; i += 1) {
    if (i === 0) {
      out.push(...ESC_POS_COMMANDS.BOLD_ON);
      out.push(...encodeAsciiText(lines[i]), LF);
      out.push(...ESC_POS_COMMANDS.BOLD_OFF);
    } else {
      out.push(...encodeAsciiText(lines[i]), LF);
    }
  }
  out.push(...ESC_POS_COMMANDS.FEED_AND_PARTIAL_CUT);
  return new Uint8Array(out);
}

export function chunkBytes(data: Uint8Array, chunkSize = 100): Uint8Array[] {
  const size = Math.max(20, chunkSize);
  const chunks: Uint8Array[] = [];
  for (let offset = 0; offset < data.length; offset += size) {
    chunks.push(data.slice(offset, offset + size));
  }
  return chunks;
}

export function formatBytesHexPreview(data: Uint8Array, maxBytes = 48): string {
  const slice = data.slice(0, maxBytes);
  const hex = Array.from(slice)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
  return data.length > maxBytes ? `${hex} ... (${data.length} bytes total)` : `${hex} (${data.length} bytes)`;
}

/** Production ticket for the baker: big cake lines, due slot, no prices. */
export function formatKitchenTicketLines(order: BillOrder, shop: ShopSettings): string[] {
  const cols = getColumnsForWidth(shop.paperWidth);
  const divider = '-'.repeat(cols);
  const lines: string[] = [];
  lines.push(centerText('KITCHEN / PRODUCTION', cols));
  lines.push(centerText(shop.shopName.toUpperCase(), cols));
  lines.push(divider);
  lines.push(padLeftRight(order.billNumber, formatDueLabel(order), cols));
  lines.push(
    padLeftRight(
      order.fulfilment?.type === 'delivery' ? 'DELIVERY' : 'PICKUP',
      orderStatus(order).toUpperCase(),
      cols,
    ),
  );
  if (order.customerName?.trim()) {
    lines.push(`For: ${order.customerName.trim().slice(0, cols - 5)}`);
  }
  lines.push(divider);
  for (const item of order.items) {
    for (const t of wrapText(`${item.quantity} x ${item.cakeName}`, cols)) {
      lines.push(t);
    }
    for (const t of wrapText(itemMeta(item), cols - 2)) {
      lines.push(`  ${t}`);
    }
    if (item.cakeMessage?.trim()) {
      for (const t of wrapText(`MSG: ${item.cakeMessage.trim()}`, cols - 2)) {
        lines.push(`  ${t}`);
      }
    }
    if (item.notes?.trim()) {
      for (const t of wrapText(`NOTE: ${item.notes.trim()}`, cols - 2)) {
        lines.push(`  ${t}`);
      }
    }
    lines.push(divider);
  }
  if (order.orderNote?.trim()) {
    for (const t of wrapText(`ORDER NOTE: ${order.orderNote.trim()}`, cols)) {
      lines.push(t);
    }
  }
  lines.push(centerText('Bake fresh. Zero preservatives.', cols));
  return lines;
}

export function encodeKitchenTicket(order: BillOrder, shop: ShopSettings): Uint8Array {
  const lines = formatKitchenTicketLines(order, shop).map((line) =>
    sanitizeAscii(line, shop.currencySymbol),
  );
  const out: number[] = [...ESC_POS_COMMANDS.INIT, ...ESC_POS_COMMANDS.ALIGN_LEFT];
  for (let i = 0; i < lines.length; i += 1) {
    if (i === 0) {
      out.push(...ESC_POS_COMMANDS.BOLD_ON, ...ESC_POS_COMMANDS.SIZE_DOUBLE_HEIGHT);
      out.push(...encodeAsciiText(lines[i]), LF);
      out.push(...ESC_POS_COMMANDS.SIZE_NORMAL, ...ESC_POS_COMMANDS.BOLD_OFF);
    } else {
      out.push(...encodeAsciiText(lines[i]), LF);
    }
  }
  out.push(...ESC_POS_COMMANDS.FEED_AND_PARTIAL_CUT);
  return new Uint8Array(out);
}
