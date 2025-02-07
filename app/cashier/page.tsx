import styles from "./page.module.css";

const dummyMenus = [
    { name: "Americano", price: 70000, stock: 20 },
    { name: "Latte", price: 75000, stock: 15 },
    { name: "Cappuccino", price: 80000, stock: 10 },
    { name: "Espresso", price: 65000, stock: 25 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Macchiato", price: 90000, stock: 8 },
    { name: "Flat White", price: 95000, stock: 12 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Affogato", price: 70000, stock: 10 },
    { name: "Cold Brew", price: 60000, stock: 18 },
    { name: "Irish Coffee", price: 100000, stock: 3 },
];

export default function Home() {
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
                    {dummyMenus.map((menu, index) => (
                        <div key={index} className={styles.menu}>
                            <div className={styles.menu_info}>
                                <div className={styles.menu_top}>
                                    <div className={styles.menu_name}>{menu.name}</div>
                                    <div className={styles.menu_price}>Rp {menu.price.toLocaleString()}</div>
                                </div>
                                <div className={styles.menu_stock}>Stock {menu.stock}</div>
                            </div>
                            <div className={styles.menu_qty}>
                                <button className={styles.qty_button}>+</button>
                                <div className={styles.qty_display}>0</div>
                                <button className={styles.qty_button}>-</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.side}>
                    <div className={styles.side_header}>
                        <h2>Oder List</h2>
                        <p>Oder List</p>
                    </div>
                    <div className={styles.side_order}>
                        <div className={styles.order_card}>
                            <div className={styles.order_number}>1</div>
                            <div className={styles.order_info}>
                                <div className={styles.order_name}>Americano</div>
                                <div className={styles.order_price}>Rp 70.000</div>
                            </div>
                            <div className={styles.order_qty}>
                                <button className={styles.order_qty_button}>+</button>
                                <div className={styles.order_qty_display}>0</div>
                                <button className={styles.order_qty_button}>-</button>
                            </div>
                        </div>
                        <div className={styles.order_card}>
                            <div className={styles.order_number}>1</div>
                            <div className={styles.order_info}>
                                <div className={styles.order_name}>Americano</div>
                                <div className={styles.order_price}>Rp 70.000</div>
                            </div>
                            <div className={styles.order_qty}>
                                <button className={styles.order_qty_button}>+</button>
                                <div className={styles.order_qty_display}>0</div>
                                <button className={styles.order_qty_button}>-</button>
                            </div>
                        </div>
                    </div>



                    <div className={styles.side_process}>
                        <div className={styles.side_process_info}>
                            <div className={styles.process_info_right}>
                                <div className={styles.info_label}>Total Transaction</div>
                                <div className={styles.info_total}>
                                    <div className={styles.total}>Rp 450.000</div>
                                    <div className={styles.total_after_discount}>Rp 500.000</div>
                                </div>
                                <div className={styles.info_desc}>
                                    <p><span className={styles.orange}>7</span> orders from <span className={styles.orange}>3</span>items</p>
                                </div>
                            </div>

                            <div className={styles.process_info_left}>
                                <div className={styles.info_label}>Discount</div>
                                <div className={styles.discount}>
                                    <input className={styles.discount_input} type="" />
                                    <p className={styles.discount_tray}>%</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.side_pay}>
                            <div className={styles.pay_customer}>
                                <label htmlFor="customer">Customer</label>
                                <input className={styles.customer_input} type="" />
                            </div>
                            <div className={styles.pay}>
                                <label htmlFor="customer">Pay</label>
                                <input className={styles.pay_input} type="" />
                            </div>
                            <div className={styles.return}>
                                <label htmlFor="return">Return</label>
                                <p className={styles.return_amount}>Rp 20.000</p>
                            </div>
                            <div className={styles.pay_submit}>
                                <button className={styles.btn_cencel}>Cencel</button>
                                <button className={styles.btn_process}>Process</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
