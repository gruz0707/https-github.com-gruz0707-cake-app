import type { BillOrder, ShopSettings } from '../types/pos';
import { formatCurrency } from './billing';

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
  // Normalize accented Latin letters (e.g. Crème -> Creme) and map Rupee symbol to ASCII Rs.
  const normalized = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return normalized
    .replaceAll('₹', currencySymbol === '₹' ? 'Rs.' : currencySymbol)
    .replace(/[^\x20-\x7E]/g, ' ');
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
  lines.push(padLeftRight(`Bill: ${order.billNumber}`, dateStr, cols));
  lines.push(padLeftRight(`Pay: ${order.paymentMethod}`, timeStr, cols));

  if (order.customerName?.trim()) {
    lines.push(`Cust: ${order.customerName.trim().slice(0, cols - 6)}`);
  }
  if (order.customerPhone?.trim()) {
    lines.push(`Ph: ${order.customerPhone.trim().slice(0, cols - 4)}`);
  }

  lines.push(divider);
  lines.push(padLeftRight('ITEM', 'AMT', cols));
  lines.push(divider);

  for (const item of order.items) {
    const lineTotal = fmt(item.unitPrice * item.quantity);
    const title = `${item.cakeName} (${item.variantLabel})`;
    const wrappedTitle = wrapText(title, cols);
    for (const t of wrappedTitle) {
      lines.push(t);
    }
    const qtyDetail = `  ${item.quantity} x ${fmt(item.unitPrice)}${item.eggless ? ' [Eggless]' : ''}`;
    lines.push(padLeftRight(qtyDetail, lineTotal, cols));

    if (item.cakeMessage?.trim()) {
      for (const msgLine of wrapText(`Msg: "${item.cakeMessage.trim()}"`, cols - 2)) {
        lines.push(`  ${msgLine}`);
      }
    }
  }

  lines.push(divider);
  lines.push(padLeftRight('Subtotal', fmt(order.subtotal), cols));

  if (order.discountAmount > 0) {
    lines.push(padLeftRight('Discount', `-${fmt(order.discountAmount)}`, cols));
  }

  if (order.taxRate > 0) {
    lines.push(padLeftRight(`Tax (${order.taxRate}%)`, fmt(order.taxAmount), cols));
  }

  lines.push(doubleDivider);
  lines.push(padLeftRight('GRAND TOTAL', fmt(order.total), cols));
  lines.push(doubleDivider);

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
  }

  return asciiSafe ? lines.map((line) => sanitizeAscii(line, shop.currencySymbol)) : lines;
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

  // Emphasize shop header on first line
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
    const isGrandTotal = line.startsWith('GRAND TOTAL');
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
