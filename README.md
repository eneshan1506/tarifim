# Tarif Dünyası (Next.js Demo)

Bu proje, yemek tarifi platformu için UI odaklı demo sürümdür. Artık temel bir sunucu taraflı kimlik doğrulama akışı da içerir.

## Özellikler

- Navbar, tarif kartları ve footer içeren modern arayüz
- Kayıt ol / giriş yap / çıkış yap akışı
- `httpOnly` oturum çerezi ile korunan profil ve favoriler sayfaları
- Yerel JSON tabanlı kullanıcı deposu

## Teknoloji

- Next.js App Router
- React
- Tailwind CSS (global stiller ile)

## Kurulum

1. Paketleri yükle:

```bash
pnpm install
```

2. Projeyi çalıştır:

```bash
pnpm dev
```

3. Gerekirse ortam değişkenini tanımla:

```bash
cp .env.example .env.local
```

## Not

Kullanıcı kayıtları geliştirme amacıyla `src/data/auth/users.json` içinde tutulur. Gerçek ortamda bunu bir veritabanı adaptörü ile değiştirmeniz gerekir.
