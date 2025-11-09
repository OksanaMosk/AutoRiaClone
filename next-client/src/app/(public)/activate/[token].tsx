import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ActivateAccount = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState<string | null>(null); // Задаємо тип для error
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
  if (token) {
    const activationUrl = `http://localhost:8888/api/auth/activate/${token}`;
    console.log("Activation URL (Client):", activationUrl);

    // Використовуємо метод PATCH або POST, залежно від того, що підтримує сервер
    fetch(activationUrl, {
      method: 'PATCH',  // або 'POST', якщо сервер не підтримує PATCH
      headers: {
        'Content-Type': 'application/json', // Додаємо заголовок для JSON
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to activate account'); // Якщо відповідь не 2xx, кидаємо помилку
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activation Response:', data);
        if (data.detail === 'Account activated successfully!') {
          setIsActivated(true);
        } else {
          setError('Failed to activate account');
        }
      })
      .catch((error) => {
        console.error('Error during activation:', error);
        setError('Failed to activate account');
      });
  }
}, [token]);

  return (
    <div>
      <h1>Activate Your Account</h1>
      {isActivated ? (
        <>
          <p>Your account has been successfully activated!</p>
        </>
      ) : (
        <p>{error ? error : 'Activating your account...'}</p>
      )}
    </div>
  );
};

export default ActivateAccount;

