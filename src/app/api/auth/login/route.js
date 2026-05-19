import { NextResponse } from "next/server";
import { buildSessionCookie, createSessionToken } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/users";
import { validateLoginInput } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/passwords";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const validated = validateLoginInput(body);

  if (!validated.ok) {
    return NextResponse.json({ ok: false, message: validated.message }, { status: 400 });
  }

  const user = await findUserByEmail(validated.data.email);

  if (!user) {
    return NextResponse.json({ ok: false, message: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const passwordMatches = await verifyPassword(validated.data.password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ ok: false, message: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const { token, expiresAt } = createSessionToken(user);
  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
  const cookie = buildSessionCookie(token, expiresAt);

  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
