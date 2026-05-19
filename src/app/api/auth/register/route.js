import { NextResponse } from "next/server";
import { buildSessionCookie, createSessionToken } from "@/lib/auth/session";
import { createUser } from "@/lib/auth/users";
import { hashPassword } from "@/lib/auth/passwords";
import { validateRegistrationInput } from "@/lib/auth/validation";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const validated = validateRegistrationInput(body);

  if (!validated.ok) {
    return NextResponse.json({ ok: false, message: validated.message }, { status: 400 });
  }

  const passwordHash = await hashPassword(validated.data.password);
  const created = await createUser({
    name: validated.data.name,
    email: validated.data.email,
    passwordHash,
  });

  if (!created.ok) {
    return NextResponse.json({ ok: false, message: created.message }, { status: 409 });
  }

  const { token, expiresAt } = createSessionToken(created.user);
  const response = NextResponse.json({
    ok: true,
    user: {
      id: created.user.id,
      name: created.user.name,
      email: created.user.email,
      createdAt: created.user.createdAt,
    },
  });
  const cookie = buildSessionCookie(token, expiresAt);

  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
