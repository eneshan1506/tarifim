import { createHmac } from "node:crypto";
import { AUTH_COOKIE_NAME, SESSION_DURATION_MS } from "@/lib/auth/constants";

function getSessionSecret() {
  return process.env.AUTH_SECRET || "dev-only-auth-secret-change-me";
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signValue(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(user) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = encodePayload({
    sub: user.id,
    name: user.name,
    email: user.email,
    expiresAt,
  });
  const signature = signValue(payload);

  return {
    token: `${payload}.${signature}`,
    expiresAt,
  };
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (signValue(payload) !== signature) {
    return null;
  }

  try {
    const parsed = decodePayload(payload);

    if (!parsed?.sub || !parsed?.email || Number(parsed?.expiresAt) <= Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function buildSessionCookie(token, expiresAt) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(expiresAt),
    },
  };
}

export function buildExpiredSessionCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    },
  };
}
