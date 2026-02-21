export const generateReceiptHTML = ({ payment, invoice, user, showroom }) => {
  const date = new Date(payment.paymentDate || Date.now()).toLocaleString('en-IN');
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
      .container { max-width: 700px; margin: 0 auto; border: 1px solid #eee; padding: 20px; }
      .header { text-align: center; margin-bottom: 20px; }
      .header h1 { margin: 0; color: #0b5ed7; }
      .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .items { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
      .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Payment Receipt</h1>
        <div>Receipt ID: ${payment.transactionId}</div>
      </div>

      <div class="row"><strong>Paid On</strong><span>${date}</span></div>
      <div class="row"><strong>Payer</strong><span>${user.name} (${user.email})</span></div>
      <div class="row"><strong>Showroom</strong><span>${showroom.name || ''} - ${showroom.address || ''}</span></div>
      <div class="row"><strong>Invoice</strong><span>${invoice.invoiceNumber || invoice._id}</span></div>
      <div class="row"><strong>Amount</strong><span>₹${Number(payment.amount).toFixed(2)}</span></div>

      <div class="items">
        <p><strong>Notes:</strong> ${invoice.notes || ''}</p>
      </div>

      <div class="footer">This is a system generated receipt. Thank you for your payment.</div>
    </div>
  </body>
  </html>
  `;
};

export default { generateReceiptHTML };
