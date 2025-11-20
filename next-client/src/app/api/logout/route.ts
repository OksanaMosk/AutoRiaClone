

import { NextResponse } from "next/server";

export function POST() {
  const response = NextResponse.redirect(new URL("/", "http://localhost:3000"));
  response.cookies.set("authToken", "", { maxAge: 0 });
  response.cookies.set("refreshToken", "", { maxAge: 0 });
  response.cookies.set("userEmail", "", { maxAge: 0 });

  return response;
}







//import { cookies } from "next/headers";
// export async function POST() {
//     const cookieStore = await cookies();
//     cookieStore.delete("authToken");
//     cookieStore.delete("refreshToken");
//     cookieStore.delete("userEmail");
//     return new Response(null, {
//         status: 302,
//         headers: {
//             Location: "/",
//         },
//     });
// }

