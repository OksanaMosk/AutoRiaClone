"use client";

import React, { useState } from "react";
import styles from "./PasswordInputComponent.module.css";
import Image from "next/image";

// Компонент PasswordInput
export const PasswordInput = ({
  value,
  onChangeAction,
  placeholder,
}: {
  value: string;
  onChangeAction: (v: string) => void; // Змінюємо ім'я тут теж
  placeholder: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.inputGroup}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required
        className={styles.input}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)} // Використовуємо нову функцію
      />
      <div className={styles.icon} onClick={() => setShow(!show)}>
        <Image
          src={show ? "/images/eye.png" : "/images/noEye.png"}
          alt="Toggle password visibility"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};
