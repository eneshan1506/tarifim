const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validateRegistrationInput(input) {
  const name = String(input?.name || "").trim();
  const email = normalizeEmail(input?.email);
  const password = String(input?.password || "");
  const passwordConfirm = String(input?.passwordConfirm || "");

  if (name.length < 2) {
    return { ok: false, message: "Ad soyad en az 2 karakter olmalıdır." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Geçerli bir e-posta adresi girin." };
  }

  if (password.length < 8) {
    return { ok: false, message: "Şifre en az 8 karakter olmalıdır." };
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return { ok: false, message: "Şifre en az bir harf ve bir rakam içermelidir." };
  }

  if (password !== passwordConfirm) {
    return { ok: false, message: "Şifreler birbiriyle eşleşmiyor." };
  }

  return {
    ok: true,
    data: { name, email, password },
  };
}

export function validateLoginInput(input) {
  const email = normalizeEmail(input?.email);
  const password = String(input?.password || "");

  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Geçerli bir e-posta adresi girin." };
  }

  if (!password) {
    return { ok: false, message: "Şifre zorunludur." };
  }

  return {
    ok: true,
    data: { email, password },
  };
}
