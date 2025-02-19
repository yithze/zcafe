"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  // // Fetch data dari db.json
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/datatransaksi");
  //       if (!response.ok) throw new Error("Failed to fetch data");
  //       const data = await response.json();
  //       setTransactions(data);
  //     } catch (error) {
  //       console.error("Error fetching transactions: ", error);
  //     }
  //   };
  //   fetchData();
  // }, []);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/datatransaksi");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      // Urutin data terbaru di atas
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(sortedData);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };
  fetchData();
}, []);


  const handlePrint = (transaction) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Invoice ID: ${transaction.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1, h2 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .invoice-details {
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <h1>Invoice Transaksi</h1>
          <h2>ID Transaksi: ${transaction.id}</h2>
          <div class="invoice-details">
            <p><strong>Customer Name:</strong> ${transaction.customerName}</p>
            <p><strong>Timestamp:</strong> ${new Date(transaction.timestamp).toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Kuantitas</th>
                <th>Harga Satuan</th>
                <th>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              ${transaction.orders
                .map(
                  (order) => `
                  <tr>
                    <td>${order.name}</td>
                    <td>${order.quantity}</td>
                    <td>Rp${order.price}</td>
                    <td>Rp${order.quantity * order.price}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div class="invoice-summary">
            <p><strong>Subtotal:</strong> Rp${transaction.subtotal}</p>
            <p><strong>Discount:</strong> ${transaction.discount}%</p>
            <p><strong>Total:</strong> Rp${transaction.total}</p>
            <p><strong>Payment:</strong> Rp${transaction.payment}</p>
            <p><strong>Return Amount:</strong> Rp${transaction.returnAmount}</p>
          </div>
          <div class="footer">
            <p>Terima kasih atas transaksi Anda!</p>
          </div>
          <script>
            window.print();
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.navbar}>
        <a href="/cashier">
          <span className={styles.tray}>◉</span>Machine
        </a>
        <a href="/transaction">
          <span className={styles.tray}>◉</span>Transaction
        </a>
      </div>

      <div className={styles.main}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Orders</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Return Amount</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.customerName}</td>
                <td>
                  {transaction.orders.map((order) => (
                    <div key={order.id}>
                      {order.name} (x{order.quantity}) - Rp{order.price}
                    </div>
                  ))}
                </td>
                <td>Rp{transaction.subtotal}</td>
                <td>{transaction.discount}%</td>
                <td>Rp{transaction.total}</td>
                <td>Rp{transaction.payment}</td>
                <td>Rp{transaction.returnAmount}</td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                <td>
                  <button
                    className={styles.invoiceButton}
                    onClick={() => handlePrint(transaction)}
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

