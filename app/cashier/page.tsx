import styles from "./page.module.css";

const dummyMenus = [
    { name: "Americano", price: 70000, stock: 20 },
    { name: "Latte", price: 75000, stock: 15 },
    { name: "Cappuccino", price: 80000, stock: 10 },
    { name: "Mocha", price: 85000, stock: 5 },
    { name: "Espresso", price: 65000, stock: 25 },
    { name: "Macchiato", price: 90000, stock: 8 },
    { name: "Flat White", price: 95000, stock: 12 },
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
                <div className={styles.side}></div>
            </div>
        </div>
    );
}
