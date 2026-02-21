export const generateInvoiceHTML = (invoice, booking, user, showroom, employee) => {
  const invoiceDate = new Date(invoice.generatedDate).toLocaleDateString('en-IN');
  const totalAmount = invoice.totalAmount;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #007bff;
          font-size: 32px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .invoice-details div {
          flex: 1;
        }
        .section-title {
          font-weight: bold;
          color: #007bff;
          border-bottom: 1px solid #007bff;
          padding-bottom: 8px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .customer-info, .showroom-info {
          margin-bottom: 15px;
          font-size: 14px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th {
          background-color: #007bff;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }
        .items-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .items-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin: 30px 0;
        }
        .totals-table {
          width: 300px;
        }
        .totals-table tr td {
          padding: 8px 15px;
          border-bottom: 1px solid #ddd;
        }
        .totals-table tr:last-child {
          background-color: #007bff;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        .notes {
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 4px solid #007bff;
          margin-top: 20px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>INVOICE</h1>
        </div>

        <div class="invoice-details">
          <div>
            <strong>Invoice No:</strong> ${invoice.invoiceNumber}<br>
            <strong>Generated Date:</strong> ${invoiceDate}<br>
            <strong>Status:</strong> ${invoice.status}
          </div>
          <div style="text-align: right;">
            <strong>Booking ID:</strong> ${booking._id}<br>
            <strong>Service Type:</strong> ${booking.serviceType}<br>
            <strong>Duration:</strong> ${booking.duration}
          </div>
        </div>

        <div class="section-title">Customer Information</div>
        <div class="customer-info">
          <strong>Name:</strong> ${user.name}<br>
          <strong>Email:</strong> ${user.email}<br>
          <strong>Phone:</strong> ${user.phone}<br>
          <strong>Car Number:</strong> ${booking.carDetails.carNumber}<br>
          <strong>Car Model:</strong> ${booking.carDetails.carModel || 'N/A'}
        </div>

        <div class="section-title">Service Center Information</div>
        <div class="showroom-info">
          <strong>Center Name:</strong> ${showroom.name}<br>
          <strong>Address:</strong> ${showroom.address}, ${showroom.city}<br>
          <strong>Phone:</strong> ${showroom.phoneNumber || 'N/A'}<br>
          <strong>Handled By:</strong> ${employee.name}
        </div>

        <div class="section-title">Service Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.itemsDescription.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right;">₹${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">₹${(invoice.partsCost + invoice.laborCost).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax (${((invoice.tax / (invoice.totalAmount - invoice.tax)) * 100 || 18).toFixed(1)}%):</td>
              <td style="text-align: right;">₹${invoice.tax.toFixed(2)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr>
                <td>Discount:</td>
                <td style="text-align: right;">-₹${invoice.discount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr>
              <td>Total Amount:</td>
              <td style="text-align: right;">₹${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${invoice.notes ? `
          <div class="notes">
            <strong>Notes:</strong><br>
            ${invoice.notes}
          </div>
        ` : ''}

        <div class="footer">
          <p>This is an electronically generated invoice. No signature required.</p>
          <p>Thank you for using our Smart Parking & Vehicle Service System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
