"use client"

import styles from "./AccountsComponent.module.css"
const AccountsComponent = () => {

    return (
            <div className={styles.container}>

                    <div className={`${styles.card} ${styles.borderCard}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/carGreen.jpg" alt="Basic Car Package" className={styles.image} />
                        <div className={styles.text}>
                            <div className={styles.content}>
                                <h3 className={styles.title}>Basic Package</h3>
                                <p className={styles.price}>$0.01*</p>
                            </div>
                        </div>
                        <ul className={styles.list}>
                            <li>✔ 1 Car Listing</li>
                            <li>✔ Visible for 30 days</li>
                            <li>✔ Standard Support</li>
                        </ul>
                    </div>

                    <div className={`${styles.card} ${styles.borderCard}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/carViolet.jpg" alt="Premium Car Package" className={styles.image} />
                        <div className={styles.text}>
                            <div className={styles.content}>
                                <h3 className={styles.title}>Premium Package</h3>
                                <p className={styles.price}>$49.99</p>
                            </div>
                            <ul className={styles.list}>
                                <li>✔ Up to 5 Car Listings</li>
                                <li>✔ Highlighted in Search Results</li>
                                <li>✔ Visible for 90 days</li>
                                <li>✔ Priority Support</li>
                            </ul>
                        </div>
                    </div>
            </div>
    );
};

export default AccountsComponent;