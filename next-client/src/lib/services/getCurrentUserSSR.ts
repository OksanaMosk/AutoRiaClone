// export async function getCurrentUserSSR(token: string) {
//   if (!token) return null;
//
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
//       headers: { Authorization: `Bearer ${token}` },
//       cache: "no-store"
//     });
//
//     if (!res.ok) return null;
//     return await res.json();
//   } catch {
//     return null;
//   }
// }
