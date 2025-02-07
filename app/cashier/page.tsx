"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

interface MenuItem {
    name: string;
    price: number;
    stock: number;
}

interface OrderItem extends MenuItem {
    quantity: number;
    orderNumber: number;
}

const dummyMenus: MenuItem[] = [
    { name: "Americano", price: 70000, stock: 20 },
    { name: "Latte", price: 75000, stock: 15 },
    { name: "Cold Brew", price: 60000, stock: 18 },
    { name: "Irish Coffee", price: 100000, stock: 3 },
];

export default function Home() {
    const [menus, setMenus] = useState<MenuItem[]>(dummyMenus);
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

    return (
        <div className={styles.page}>
            <div className={styles.navbar}>
                <a href="#">
                    <span className={styles.tray}>◉</span>Machine
                </a>
                <a href="#">
                    <span className={styles.tray}>◉</span>Transaction
                </a>
            </div>

            <div className={styles.main}>
                <div className={styles.menu_container}>
                    {menus.map((menu, index) => {
                        const orderItem = orders.find(order => order.name === menu.name);
                        return (
                            <div 
                                key={index} 
                                className={`${styles.menu} ${orderItem ? styles.menu_ordered : ''}`}
                                onClick={() => handleMenuClick(menu)}
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
                                        <div className={styles.total_after_discount}>
                                            Rp {subtotal.toLocaleString()}
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
                                        type="number"
                                        value={discount}
                                        onChange={handleDiscountChange}
                                        min="0"
                                        max="100"
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
                                    onClick={handleProcess}
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
