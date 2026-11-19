/**
 * HomeHub — Official Commercial Invoice Generator & Print Service
 * Generates an elegant, printable architectural invoice formatted for A4 & receipt printing.
 */

import { formatPKR } from './helpers.js';

export function openPrintInvoice(order) {
  if (!order) return;

  const orderNum = order.order_number || order.id || 'HH-ORDER';
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const customerName = order.customer_name || order.customerName || 'Valued Patron';
  const customerEmail = order.customer_email || order.customerEmail || '—';
  const customerPhone = order.customer_phone || order.customerPhone || '—';
  const shippingCity = order.shipping_city || order.shippingCity || 'Pakistan';
  const shippingAddress = order.shipping_address || order.shippingAddress || '—';
  const paymentMethod = order.payment_method || 'Cash on White-Glove Delivery';
  const orderStatus = order.status || 'PENDING';
  const syncStatus = order.sync_status === 'CLOUD_CONFIRMED' ? 'Confirmed in Cloud' : 'Atelier Outbox Registry';

  const subtotal = Number(order.subtotal_amount || order.subtotal || 0);
  const discount = Number(order.discount_amount || order.discount || 0);
  const total = Number(order.total_amount || order.total || 0);
  const items = Array.isArray(order.items) ? order.items : [];

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${orderNum} — HomeHub Atelier</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #302E2A;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .invoice-wrapper {
      max-width: 780px;
      margin: 0 auto;
      border: 1px solid #E8E1D7;
      padding: 36px;
      background: #FFFFFF;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #302E2A;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand-mark {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #302E2A;
    }
    .brand-tagline {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #899581;
      margin-top: 4px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #302E2A;
      margin: 0 0 6px 0;
    }
    .invoice-id {
      font-family: monospace;
      font-size: 13px;
      color: #899581;
      font-weight: 600;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
      font-size: 12px;
    }
    .info-card {
      background: #FBF9F5;
      padding: 16px;
      border: 1px solid #F1ECE4;
    }
    .info-card h4 {
      margin: 0 0 8px 0;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #899581;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      font-size: 12px;
    }
    .items-table th {
      background: #F8F5EF;
      color: #302E2A;
      font-weight: 600;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #E8E1D7;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #F1ECE4;
      vertical-align: middle;
    }
    .items-table .num-col { text-align: right; }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .totals-box {
      width: 280px;
      font-size: 12px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      color: #6E6860;
    }
    .totals-row.grand {
      border-top: 2px solid #302E2A;
      margin-top: 6px;
      padding-top: 10px;
      font-weight: 700;
      font-size: 15px;
      color: #302E2A;
    }
    .invoice-footer {
      border-top: 1px solid #E8E1D7;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #899581;
    }
    .action-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .action-btn {
      background: #302E2A;
      color: #F8F5EF;
      border: none;
      padding: 8px 18px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    @media print {
      .action-bar { display: none !important; }
      body { padding: 0; }
      .invoice-wrapper { border: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button class="action-btn" onclick="window.print()">🖨️ Print / Download PDF</button>
    <button class="action-btn" style="background: #899581;" onclick="window.close()">✕ Close</button>
  </div>

  <div class="invoice-wrapper">
    <div class="invoice-header">
      <div>
        <div class="brand-mark">HOMEHUB</div>
        <div class="brand-tagline">SHOP • STYLE • SMART — ATELIER ARCHITECTURAL LIVING</div>
        <div style="font-size: 11px; color: #6E6860; margin-top: 6px;">
          Atelier Direct: Lahore • Karachi • Islamabad | Phone: +92 300 1234567<br>
          Email: atelier@homehub.style | Web: www.homehub.style
        </div>
      </div>
      <div class="invoice-meta">
        <h2 class="invoice-title">OFFICIAL INVOICE</h2>
        <div class="invoice-id">REF: ${orderNum}</div>
        <div style="font-size: 11px; color: #6E6860; margin-top: 4px;">Date: ${orderDate}</div>
        <div style="font-size: 10px; color: #899581; margin-top: 2px;">Registry: ${syncStatus}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h4>BILLED / DELIVER TO:</h4>
        <div style="font-weight: 600; font-size: 13px; color: #302E2A;">${customerName}</div>
        <div>${shippingAddress}</div>
        <div>${shippingCity}, Pakistan</div>
        <div style="margin-top: 4px;">Phone: ${customerPhone}</div>
        <div>Email: ${customerEmail}</div>
      </div>
      <div class="info-card">
        <h4>ORDER & DISPATCH SPECIFICATIONS:</h4>
        <div><strong>Payment Terms:</strong> ${paymentMethod}</div>
        <div><strong>Fulfillment Status:</strong> <span style="font-weight:600; color:#899581;">${orderStatus}</span></div>
        <div><strong>White-Glove Delivery:</strong> Staged Architectural Placement</div>
        <div><strong>Currency:</strong> Pakistani Rupee (PKR / ₨)</div>
        ${order.customer_notes ? `<div style="margin-top:4px;"><strong>Patron Notes:</strong> ${order.customer_notes}</div>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item / Architectural Piece</th>
          <th>SKU</th>
          <th>Variant</th>
          <th class="num-col">Qty</th>
          <th class="num-col">Unit Price</th>
          <th class="num-col">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(it => `
          <tr>
            <td><strong>${it.product_name || it.name || it.sku}</strong></td>
            <td><code style="font-size:11px;">${it.sku}</code></td>
            <td>${it.variant_name || 'Standard Curation'}</td>
            <td class="num-col">${it.quantity || 1}</td>
            <td class="num-col">${formatPKR(it.price || 0)}</td>
            <td class="num-col"><strong>${formatPKR((it.price || 0) * (it.quantity || 1))}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${formatPKR(subtotal)}</span>
        </div>
        ${discount > 0 ? `
          <div class="totals-row" style="color:#899581;">
            <span>Promotional Privilege Voucher:</span>
            <span>- ${formatPKR(discount)}</span>
          </div>
        ` : ''}
        <div class="totals-row">
          <span>White-Glove Delivery:</span>
          <span>Complimentary</span>
        </div>
        <div class="totals-row grand">
          <span>Total Balance Due:</span>
          <span>${formatPKR(total)}</span>
        </div>
      </div>
    </div>

    <div class="invoice-footer">
      <p style="margin: 0 0 4px 0; font-weight: 600;">Thank you for furnishing your sanctuary with HomeHub Atelier.</p>
      <p style="margin: 0;">Heirloom Craftsmanship Guarantee • 10-Year Timber Warranty • White-Glove Installation Included</p>
    </div>
  </div>
</body>
</html>
  `;

  const printWin = window.open('', '_blank', 'width=900,height=800,scrollbars=yes');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(invoiceHtml);
    printWin.document.close();
  }
}
