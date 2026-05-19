// Tüm sayfalarda kullanılacak ortak mock veriler.
// Backend bağlandığında bu dosya kaldırılıp API'den çekilecek.

export const categories = [
  { slug: "ana-yemek",      emoji: "🍖", label: "Ana Yemek",      count: 248, color: "#fee2e2", accent: "#dc2626", desc: "Sofranın baş tacı, doyurucu ana yemek tarifleri" },
  { slug: "corba",          emoji: "🥣", label: "Çorbalar",        count: 124, color: "#fef3c7", accent: "#d97706", desc: "Sıcacık, şifalı çorba tarifleri" },
  { slug: "salata",         emoji: "🥗", label: "Salatalar",       count: 89,  color: "#d1fae5", accent: "#059669", desc: "Hafif ve sağlıklı salata çeşitleri" },
  { slug: "tatli",          emoji: "🍰", label: "Tatlılar",        count: 312, color: "#fce7f3", accent: "#db2777", desc: "Ağızda dağılan tatlı tarifleri" },
  { slug: "kahvalti",       emoji: "🥞", label: "Kahvaltılık",     count: 76,  color: "#fff7ed", accent: "#ea580c", desc: "Güne güzel başlatan kahvaltılıklar" },
  { slug: "icecek",         emoji: "🍹", label: "İçecekler",       count: 55,  color: "#ede9fe", accent: "#7c3aed", desc: "Serinleten ve ferahlatan içecek tarifleri" },
  { slug: "hamur-isi",      emoji: "🥐", label: "Hamur İşleri",    count: 198, color: "#fef9c3", accent: "#ca8a04", desc: "Börek, poğaça, ekmek ve pasta tarifleri" },
  { slug: "aperatif",       emoji: "🧆", label: "Aperatifler",     count: 143, color: "#ffedd5", accent: "#c2410c", desc: "Misafirlere özel atıştırmalık ve mezeler" },
  { slug: "deniz-urunleri", emoji: "🐟", label: "Deniz Ürünleri",  count: 67,  color: "#e0f2fe", accent: "#0284c7", desc: "Taze balık ve deniz mahsulleri tarifleri" },
  { slug: "vegan",          emoji: "🌱", label: "Vegan",           count: 93,  color: "#ecfccb", accent: "#65a30d", desc: "Bitkisel bazlı sağlıklı tarifler" },
  { slug: "bebek",          emoji: "👶", label: "Bebek Mamaları",  count: 41,  color: "#fdf2f8", accent: "#c026d3", desc: "Minikler için besleyici mama tarifleri" },
  { slug: "dunya-mutfagi",  emoji: "🌍", label: "Dünya Mutfağı",   count: 156, color: "#f0fdf4", accent: "#16a34a", desc: "İtalyan, Meksika, Uzak Doğu ve daha fazlası" },
];

export const recipes = [
  {
    id: 1, title: "Fırında Kağıt Kebabı", slug: "firinda-kagit-kebabi", category: "ana-yemek",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    time: 65, difficulty: "Orta", dColor: "#f59e0b", likes: 342, comments: 28,
    author: "Ayşe K.", aColor: "#e8930f",
    desc: "Yumuşacık et parçaları, sebzeler ve baharatlarla fırında pişen nefis kağıt kebabı tarifi.",
  },
  {
    id: 2, title: "Mercimek Çorbası", slug: "mercimek-corbasi", category: "corba",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    time: 35, difficulty: "Kolay", dColor: "#22c55e", likes: 567, comments: 45,
    author: "Fatma Y.", aColor: "#059669",
    desc: "Klasik Türk mutfağının vazgeçilmez lezzeti, kremamsı mercimek çorbası.",
  },
  {
    id: 3, title: "San Sebastian Cheesecake", slug: "san-sebastian-cheesecake", category: "tatli",
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80",
    time: 50, difficulty: "Orta", dColor: "#f59e0b", likes: 891, comments: 67,
    author: "Zeynep A.", aColor: "#db2777",
    desc: "Üstü karamelize, içi kremamsı efsane cheesecake tarifi.",
  },
  {
    id: 4, title: "Karnıyarık", slug: "karniyarik", category: "ana-yemek",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80",
    time: 55, difficulty: "Orta", dColor: "#f59e0b", likes: 456, comments: 34,
    author: "Mehmet D.", aColor: "#c84f03",
    desc: "Kızartılmış patlıcanlar üzerine kıymalı harç ile hazırlanan klasik lezzet.",
  },
  {
    id: 5, title: "Çıtır Börek", slug: "citir-borek", category: "hamur-isi",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    time: 40, difficulty: "Kolay", dColor: "#22c55e", likes: 234, comments: 19,
    author: "Hatice T.", aColor: "#ca8a04",
    desc: "Yufka ile hazırlanan peynirli çıtır çıtır börek tarifi.",
  },
  {
    id: 6, title: "Atom Salata", slug: "atom-salata", category: "salata",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    time: 15, difficulty: "Kolay", dColor: "#22c55e", likes: 189, comments: 12,
    author: "Selin M.", aColor: "#059669",
    desc: "Acılı, ekşili, bol malzemeli atom salata tarifi.",
  },
  {
    id: 7, title: "Tavuk Sote", slug: "tavuk-sote", category: "ana-yemek",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80",
    time: 45, difficulty: "Kolay", dColor: "#22c55e", likes: 378, comments: 29,
    author: "Ali R.", aColor: "#2563eb",
    desc: "Sebzeli, soslu nefis tavuk sote tarifi.",
  },
  {
    id: 8, title: "Künefe", slug: "kunefe", category: "tatli",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    time: 30, difficulty: "Zor", dColor: "#ef4444", likes: 723, comments: 52,
    author: "Hasan B.", aColor: "#dc2626",
    desc: "Peynirli, şerbetli, çıtır çıtır geleneksel künefe.",
  },
  {
    id: 9, title: "Ezogelin Çorbası", slug: "ezogelin-corbasi", category: "corba",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    time: 40, difficulty: "Kolay", dColor: "#22c55e", likes: 445, comments: 31,
    author: "Elif S.", aColor: "#e8930f",
    desc: "Bulgur ve mercimekle yapılan geleneksel Türk çorbası.",
  },
  {
    id: 10, title: "Falafel", slug: "falafel", category: "vegan",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    time: 25, difficulty: "Orta", dColor: "#f59e0b", likes: 167, comments: 14,
    author: "Derya K.", aColor: "#65a30d",
    desc: "Nohuttan yapılan çıtır dışı yumuşak içi vegan köfte.",
  },
  {
    id: 11, title: "Limonata", slug: "limonata", category: "icecek",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80",
    time: 10, difficulty: "Kolay", dColor: "#22c55e", likes: 298, comments: 8,
    author: "Burcu N.", aColor: "#7c3aed",
    desc: "Ev yapımı ferahlatıcı naneli limonata.",
  },
  {
    id: 12, title: "Menemen", slug: "menemen", category: "kahvalti",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    time: 20, difficulty: "Kolay", dColor: "#22c55e", likes: 534, comments: 41,
    author: "Kemal Ö.", aColor: "#ea580c",
    desc: "Domatesli, biberli, yumurtalı klasik Türk kahvaltısı.",
  },
];

export const popularAuthors = [
  { name: "Ayşe K.",   recipes: 48, followers: 1240, color: "#e8930f" },
  { name: "Zeynep A.", recipes: 35, followers: 2100, color: "#db2777" },
  { name: "Fatma Y.",  recipes: 62, followers: 890,  color: "#059669" },
  { name: "Mehmet D.", recipes: 29, followers: 560,  color: "#c84f03" },
];

export const faqItems = [
  { q: "Nasıl üye olurum?",                             a: "Ana sayfadaki 'Üye' butonuna tıklayarak veya giriş sayfasından 'Kayıt Ol' seçeneğiyle hızlıca üye olabilirsiniz. E-posta veya Google hesabınızla kayıt olabilirsiniz." },
  { q: "Tarif paylaşmak için ne yapmalıyım?",           a: "Üye girişi yaptıktan sonra sağ üstteki '+' butonuna veya profil menüsündeki 'Tarif Ekle' seçeneğine tıklayarak tarif paylaşabilirsiniz." },
  { q: "Tariflerimi düzenleyebilir miyim?",             a: "Evet, profilinizden paylaştığınız tariflere giderek 'Düzenle' butonuyla istediğiniz zaman güncelleyebilirsiniz." },
  { q: "Favorilere nasıl eklerim?",                     a: "Tarif kartlarindaki favori butonuna tiklayarak tarifi favorilerinize ekleyebilirsiniz. Favorilerinize 'Favoriler' sayfasindan ulasabilirsiniz." },
  { q: "Yorum yapmak için üye olmam gerekiyor mu?",     a: "Evet, yorum yapabilmek ve tarifleri beğenebilmek için üye girişi yapmanız gerekmektedir." },
  { q: "Tarif görselleri için önerilen boyut nedir?",   a: "En iyi görünüm için 1200x800 piksel, yatay formatta ve yüksek çözünürlüklü görseller öneriyoruz." },
  { q: "Hesabımı nasıl silebilirim?",                   a: "Profil ayarlarından 'Hesabı Sil' seçeneğini kullanabilirsiniz. Bu işlem geri alınamaz, tüm tarifleriniz ve yorumlarınız kalıcı olarak silinir." },
  { q: "Başka bir kullanıcının tarifini şikayet edebilir miyim?", a: "Evet, tarif sayfasının altındaki '⚑ Şikayet Et' bağlantısını kullanarak uygunsuz içerikleri bildirebilirsiniz." },
];
