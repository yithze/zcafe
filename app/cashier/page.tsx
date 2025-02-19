"use client";

import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface OrderItem extends MenuItem {
    quantity: number;
    orderNumber: number;
}


export default function Home() {
    // const [menus, setMenus] = useState<MenuItem[]>(dummyMenus);
    const [menus, setMenus] = useState<MenuItem[]>([]);
    // useEffect(() => {
    //     // Fetch menu dari JSON Server
    //     fetch("http://localhost:3001/menus")
    //         .then((response) => response.json())
    //         .then((data) => setMenus(data))
    //         .catch((error) => console.error("Error fetching menus:", error));
    // }, []);
    useEffect(() => {
    // Fetch menu dari JSON Server
    fetch("http://localhost:3001/menus")
        .then((response) => response.json())
        .then((data) => {
            // Sort biar stock 0 ada di paling bawah
            const sortedData = data.sort((a: MenuItem, b: MenuItem) => {
                if (a.stock === 0 && b.stock !== 0) return 1;
                if (a.stock !== 0 && b.stock === 0) return -1;
                return 0;
            });
            setMenus(sortedData);
        })
        .catch((error) => console.error("Error fetching menus:", error));
}, []);


    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [customerName, setCustomerName] = useState<string>('');
    const [payment, setPayment] = useState<string>('');
    const [nextOrderNumber, setNextOrderNumber] = useState<number>(1);

    // Calculate totals
    const subtotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    const returnAmount = payment ? Number(payment) - total : 0;

    // Handle menu item selection
    const handleMenuClick = (menu: MenuItem) => {
        const existingOrder = orders.find(order => order.name === menu.name);

        if (existingOrder) {
            handleQuantityChange(existingOrder.orderNumber, existingOrder.quantity + 1);
        } else {
            setOrders([...orders, {
                ...menu,
                quantity: 1,
                orderNumber: nextOrderNumber
            }]);
            setNextOrderNumber(prev => prev + 1);
        }
    };

    useEffect(() => {
        const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);
        if (totalItems >= 10) {
            setDiscount(10); // Diskon 10% buat 10 item atau lebih
        } else if (totalItems >= 5) {
            setDiscount(5); // Diskon 5% buat 5 item atau lebih
        } else {
            setDiscount(0); // Tanpa diskon kalau kurang dari 5 item
        }
    }, [orders]);


    // Handle quantity changes in menu
    const handleMenuQuantityChange = (menuName: string, change: number) => {
        const existingOrder = orders.find(order => order.name === menuName);

        if (existingOrder) {
            handleQuantityChange(existingOrder.orderNumber, existingOrder.quantity + change);
        } else if (change > 0) {
            const menu = menus.find(m => m.name === menuName);
            if (menu) {
                setOrders([...orders, {
                    ...menu,
                    quantity: 1,
                    orderNumber: nextOrderNumber
                }]);
                setNextOrderNumber(prev => prev + 1);
            }
        }
    };

    // Handle quantity changes in order list
    const handleQuantityChange = (orderNumber: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setOrders(orders.filter(order => order.orderNumber !== orderNumber));
        } else {
            const orderItem = orders.find(order => order.orderNumber === orderNumber);
            if (orderItem && newQuantity <= menus.find(m => m.name === orderItem.name)!.stock) {
                setOrders(orders.map(order =>
                    order.orderNumber === orderNumber
                        ? { ...order, quantity: newQuantity }
                        : order
                ));
            }
        }
    };

    // Handle discount change
    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
        setDiscount(value);
    };

    // Handle payment change
    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayment(e.target.value);
    };

    // Handle process payment
    const handleProcess = () => {
        if (Number(payment) >= total) {
            // Save order to JSON (you would typically send this to an API)
            const orderData = {
                customerName,
                orders,
                subtotal,
                discount,
                total,
                payment: Number(payment),
                returnAmount,
                timestamp: new Date().toISOString()
            };

            console.log('Order processed:', orderData);
            // Reset form
            setOrders([]);
            setDiscount(0);
            setCustomerName('');
            setPayment('');
            setNextOrderNumber(1);
        } else {
            alert('Payment amount is insufficient!');
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setOrders([]);
        setDiscount(0);
        setCustomerName('');
        setPayment('');
        setNextOrderNumber(1);
    };

    // const handleProcessTransaction = () => {
    //     if (Number(payment) >= total) {
    //         const orderData = {
    //             customerName,
    //             orders,
    //             subtotal,
    //             discount,
    //             total,
    //             payment: Number(payment),
    //             returnAmount,
    //             timestamp: new Date().toISOString(),
    //         };
    //
    //         fetch("http://localhost:3001/datatransaksi", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(orderData),
    //         })
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     throw new Error("Failed to save transaction");
    //                 }
    //                 return response.json();
    //             })
    //             .then(() => {
    //                 toast.success("Transaksi berhasil diproses!");
    //                 setOrders([]);
    //                 setDiscount(0);
    //                 setCustomerName("");
    //                 setPayment("");
    //                 setNextOrderNumber(1);
    //             })
    //             .catch((error) => {
    //                 console.error("Error saving transaction:", error);
    //                 toast.error("Terjadi kesalahan saat memproses transaksi");
    //             });
    //     } else {
    //         toast.error("Pembayaran tidak mencukupi!");
    //     }
    // };
    const handleProcessTransaction = () => {
        if (Number(payment) >= total) {
            const orderData = {
                customerName,
                orders,
                subtotal,
                discount,
                total,
                payment: Number(payment),
                returnAmount,
                timestamp: new Date().toISOString(),
            };

            // Proses transaksi dulu
            fetch("http://localhost:3001/datatransaksi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to save transaction");
                    }
                    return response.json();
                })
                .then(() => {
                    // Update stok menu setelah transaksi berhasil
                    const updateStockPromises = orders.map(order => {
                        const updatedStock = menus.find(m => m.id === order.id)!.stock - order.quantity;
                        return fetch(`http://localhost:3001/menus/${order.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ stock: updatedStock }),
                        });
                    });

                    return Promise.all(updateStockPromises);
                })
                .then(() => {
                    toast.success("Transaksi berhasil diproses dan stok diperbarui!");
                    setOrders([]);
                    setDiscount(0);
                    setCustomerName("");
                    setPayment("");
                    setNextOrderNumber(1);

                    // Fetch ulang data menu buat update stok di UI
                    return fetch("http://localhost:3001/menus")
                        .then(response => response.json())
                        .then(data => setMenus(data));
                })
                .catch((error) => {
                    console.error("Error processing transaction:", error);
                    toast.error("Terjadi kesalahan saat memproses transaksi");
                });
        } else {
            toast.error("Pembayaran tidak mencukupi!");
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
                <div className={styles.menu_container}>
                    {menus.map((menu) => {
                        const orderItem = orders.find(order => order.name === menu.name);

                        return (
                            <div
                                key={menu.id}
                                className={`${styles.menu} ${orderItem ? styles.menu_ordered : ''} ${menu.stock === 0 ? styles.menu_disabled : ''}`}
                                onClick={() => menu.stock > 0 && handleMenuClick(menu)}
                            >

                                <div className={styles.menu_info}>
                                    <div className={styles.menu_top}>
                                        <div className={styles.menu_name}>{menu.name}</div>
                                        <div className={styles.menu_price}>Rp {menu.price.toLocaleString()}</div>
                                    </div>
                                    <div className={styles.menu_stock}>Stock {menu.stock}</div>
                                </div>
                                <div className={styles.menu_qty}>
                                    <button
                                        className={styles.qty_button}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuQuantityChange(menu.name, 1);
                                        }}
                                        disabled={menu.stock === 0}
                                    >+</button>

                                    <div className={styles.qty_display}>
                                        {orderItem?.quantity || 0}
                                    </div>
                                    <button
                                        className={styles.qty_button}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuQuantityChange(menu.name, -1);
                                        }}
                                    >-</button>
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className={styles.side}>
                    <div className={styles.side_header}>
                        <h2>Order List</h2>
                        <p>Order List</p>
                    </div>

                    <div className={styles.side_order}>
                        {orders.map((order) => (
                            <div key={order.orderNumber} className={styles.order_card}>
                                <div className={styles.order_number}>{order.orderNumber}</div>
                                <div className={styles.order_info}>
                                    <div className={styles.order_name}>{order.name}</div>
                                    <div className={styles.order_price}>
                                        Rp {(order.price * order.quantity).toLocaleString()}
                                    </div>
                                </div>
                                <div className={styles.order_qty}>
                                    <button
                                        className={styles.order_qty_button}
                                        onClick={() => handleQuantityChange(order.orderNumber, order.quantity + 1)}
                                        disabled={order.quantity >= menus.find(m => m.id === order.id)?.stock!}
                                    >+</button>

                                    <div className={styles.order_qty_display}>{order.quantity}</div>
                                    <button
                                        className={styles.order_qty_button}
                                        onClick={() => handleQuantityChange(order.orderNumber, order.quantity - 1)}
                                    >-</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.side_process}>
                        <div className={styles.side_process_info}>
                            <div className={styles.process_info_right}>
                                <div className={styles.info_label}>Total Transaction</div>
                                <div className={styles.info_total}>
                                    <div className={styles.total}>
                                        Rp {total.toLocaleString()}
                                    </div>
                                    {discount > 0 && (
                                        <div className={styles.calc}>
                                            <span className={styles.total_before_discount}>
                                                Rp {subtotal.toLocaleString()}
                                            </span>
                                            <span className={styles.discount_value}>
                                                - Rp {discountAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.info_desc}>
                                    <p>
                                        <span className={styles.orange}>
                                            {orders.reduce((sum, order) => sum + order.quantity, 0)}
                                        </span> orders from <span className={styles.orange}>
                                            {orders.length}
                                        </span> items
                                    </p>
                                </div>
                            </div>

                            <div className={styles.process_info_left}>
                                <div className={styles.info_label}>Discount</div>
                                <div className={styles.discount}>
                                    <input
                                        className={styles.discount_input}
                                        type="text"
                                        value={discount}
                                        onChange={handleDiscountChange}
                                        max="100"
                                        inputMode="numeric"
                                        readOnly
                                        disabled
                                    />
                                    <p className={styles.discount_tray}>%</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.side_pay}>
                            <div className={styles.pay_customer}>
                                <label htmlFor="customer">Customer</label>
                                <input
                                    className={styles.customer_input}
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className={styles.pay}>
                                <label htmlFor="payment">Pay</label>
                                <input
                                    className={styles.pay_input}
                                    type="number"
                                    value={payment}
                                    onChange={handlePaymentChange}
                                />
                            </div>
                            <div className={styles.return}>
                                <label htmlFor="return">Return</label>
                                <p className={styles.return_amount}>
                                    Rp {Math.max(0, returnAmount).toLocaleString()}
                                </p>
                            </div>
                            <div className={styles.pay_submit}>
                                <button
                                    className={styles.btn_cencel}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.btn_process}
                                    onClick={handleProcessTransaction}
                                    disabled={!orders.length || !customerName || Number(payment) < total}
                                >
                                    Process
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
