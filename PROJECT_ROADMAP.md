# Tarif App Yol Haritasi

Bu dosya, proje ilerleme durumunu, eksikleri, görev paylaşımını ve bir sonraki adımları takip etmek için tutulur.
Her yeni oturumda önce bu dosya okunmalı, sonra kaldığımız yerden devam edilmelidir.

## 1. Mevcut Durum

Genel değerlendirme:
- Proje şu anda `frontend-first demo + kisitli auth backend` aşamasında.
- Ana kullanıcı akışı görsel olarak kurulmuş durumda: ana sayfa, listeleme, kategori, detay, favoriler, giriş, profil.
- Gerçek ürün backend'i henüz kurulmuş değil.
- Sadece kimlik doğrulama tarafında temel bir backend başlangıcı var.

Bugün itibarıyla tamamlananlar:
- Next.js App Router tabanlı uygulama iskeleti var.
- UI bileşenleri ve sayfa yapıları büyük ölçüde hazır.
- `login / register / me / logout` API route'ları mevcut.
- `httpOnly` cookie ile session mantığı kurulmuş.
- Profil sayfası server tarafında korumalı.

Henüz demo / geçici durumda olan alanlar:
- Tarif verileri `src/data/mockData.js` içinden geliyor.
- Kullanıcı verileri `src/data/auth/users.json` içinde tutuluyor.
- Favoriler gerçek kullanıcı verisine bağlı değil.
- Profil istatistikleri gerçek backend verisi değil.
- Tarif detayındaki yorumlar, malzemeler ve adımlar mock.
- Bazı CTA'ler henüz gerçek sayfalara bağlanmamış.

## 2. UI/UX Tarafında Eksikler

UI seviyesi:
- Görsel yön güçlü, sıcak ve tutarlı.
- Demo sunumu için yeterli.
- Ürünleştirme için bazı kritik UX boşlukları var.
- Arayüzde ilk bakışta enerji var, ancak bazı yüzeylerde fazla border ve aynı tip kart dili kullanıldığı için yer yer `AI ile hızlı üretilmiş demo` hissi oluşuyor.

Eksikler:
- `Tarif Ekle` butonu var ama ilgili route görünmüyor.
- `Kullanım Şartları` ve `Gizlilik` linkleri var ama sayfalar görünmüyor.
- Favori alma, beğeni, kaydetme işlemleri kalıcı değil.
- Navbar'daki dil seçimi sadece görsel; gerçek i18n yok.
- Formlarda istemci tarafı validasyon deneyimi daha zengin hale getirilmeli.
- Boş durumlar var ama hata durumları ve loading durumları sınırlı.
- Detay sayfasındaki yorum akışı gerçek kullanıcı etkileşimine bağlı değil.
- Erişilebilirlik tarafında temel düşünülmüş olsa da form hata ilişkilendirmeleri, klavye akışları ve screen reader geri bildirimi daha da iyileştirilmeli.
- Tasarım sistemi henüz bileşen seviyesinde standartlaşmış değil; renk, spacing, input/button varyantları ileride ortaklaştırılmalı.
- Aynı sıcak palet başarılı olsa da yüzey dili fazla homojen; her blok `rounded + border + shadow` kalıbına çok sık giriyor.
- Bazı bileşenlerde görsel ayrım için sadece border kullanılmış; bunun yerine katman, boşluk, tonal yüzey ve gölge ile ayrım kurulmalı.
- CTA hiyerarşisi bazı sayfalarda fazla eşit; ana eylem ile ikincil eylem arasında kontrast artırılmalı.
- Liste ve kart ekranlarında içerik yoğunluğu iyi, fakat editoryal ritim eksik; daha büyük sessiz alanlar ve daha az çerçeve daha rafine görünüm verecek.

Bu başlık altında uygulanacak tasarım prensipleri:
- Büyük yüzeylerde border azaltılacak, gerekirse çok hafif `ring` veya sadece gölge kullanılacak.
- Kartların hepsi aynı kapsül dilinde olmayacak; bazı alanlarda sadece tonal arka plan ile ayrım kurulacak.
- İkincil butonlar ve filtreler daha sessiz hale getirilecek; ana CTA daha net kalacak.
- Form kutularında border kalabilir, ama container seviyesinde gereksiz çerçeveler azaltılacak.
- Sayfa başlıkları ile içerik blokları arasında daha fazla nefes alanı bırakılacak.

Hemen tamamlanması gereken UI/UX işleri:
- `Tarif Ekle`, `Gizlilik`, `Kullanım Şartları` için ya gerçek route açılmalı ya da CTA geçici olarak kapatılmalı.
- Auth, favori, yorum ve arama akışlarına loading / error / success durumları eklenmeli.
- Favori ve beğeni davranışları gerçek veriye bağlanana kadar kullanıcıya geçici olduğuna dair daha dürüst geri bildirim verilmeli.
- Border yoğunluğu ana sayfa, navbar, tarif listesi, giriş ve profil ekranlarında azaltılmalı.

Bugün bu başlık altında tamamlananlar:
- Ana sayfa, navbar, tarif listesi, kategoriler, giriş, profil, favoriler ve footer yüzeylerinde border yoğunluğu azaltıldı.
- Bazı container'larda düz border yerine daha hafif `ring`, tonal arka plan ve daha doğal gölge dili kullanıldı.
- Görsel dil bir miktar daha az "AI demo kart sistemi" hissi verecek şekilde yumuşatıldı.

UI/UX açısından backend'e geçmeden önce ideal minimum seviye:
- Kırık veya boş CTA kalmaması
- Tüm ana akışlarda loading / success / error durumları
- Gerçek veri gelince bozulmayacak kart ve liste yapıları
- Form deneyimlerinin netleştirilmesi
- Görsel dilin border bağımlılığından çıkarılıp daha rafine bir yüzey sistemine oturtulması

## 3. Backend'e Ne Zaman Geçmeliyiz?

Kısa cevap:
- Artık backend fazına geçilebilir.

Neden:
- Frontend demo seviyesi, ürünün bilgi mimarisini gösterecek kadar oturmuş.
- Bundan sonra sadece UI cilası yapmak verimi düşürür.
- Gerçek kullanıcı değeri oluşturan alanlar artık veri modeline bağlı:
  - tarif oluşturma
  - favoriler
  - yorumlar
  - kullanıcı profili
  - arama / filtreleme

Öneri:
- Backend'e hemen geçelim, ama frontend'i tamamen bırakmadan ilerleyelim.
- En doğru model: `backend-first for core flows`, `frontend polish in parallel`.

## 4. Öncelikli Backend Kapsamı

İlk backend fazında hedeflenecek çekirdek alanlar:

1. Kullanıcı sistemi
- Mevcut dosya tabanlı user yapısını veritabanına taşımak
- Session veya auth yapısını production'a uygun hale getirmek

2. Tarif veri modeli
- tarif
- kategori
- tarif adımları
- tarif malzemeleri
- tarif yazarı

3. Kullanıcı etkileşimleri
- favoriler
- beğeniler
- yorumlar

4. İçerik yönetimi
- tarif ekleme
- tarif düzenleme
- tarif silme

5. Listeleme ve keşif
- arama
- kategori filtreleme
- sıralama
- yeni eklenenler
- popüler tarifler

## 5. Görev Paylaşımı

### Benim sorumluluklarım

Benim üstlenmem en verimli olan alanlar:
- Veri modeli ve mimari tasarımı
- Veritabanı şema önerisi ve implementasyonu
- API route veya server action yapısının kurulması
- Auth akışının güçlendirilmesi
- Frontend ile backend bağlantısının kodlanması
- Mock veriden gerçek veriye geçiş
- Teknik refactor'lar
- Kod kalitesi, validasyon ve hata yönetimi
- Dokümantasyonun güncellenmesi

### Senin sorumlulukların

Senin en çok değer katacağın alanlar:
- Ürün kararları
- Önceliklendirme
- Tarif veri alanlarında iş kuralları netleştirme
- Yönetici mi olacak, sadece kullanıcı mı olacak gibi rol kararları
- Tarif ekleme formunda hangi alanların zorunlu olacağı
- Yorum/moderasyon kuralları
- Favori, beğeni, takip gibi sosyal özelliklerin kapsamı
- İçerik örnekleri, gerçek tarif metinleri, kategori kapsamı
- UI tarafında beğendiğin / beğenmediğin deneyim kararları
- Gerekirse test ve manuel kabul kontrolü

### Birlikte karar vermemiz gerekenler

- Hangi veritabanı kullanılacak
- Hangi auth yaklaşımı kullanılacak
- Admin panel gerekip gerekmediği
- Görsel yükleme altyapısı
- SEO detay seviyesi
- İlk canlıya çıkış kapsamı
- Ayrı bir backend framework gerekip gerekmediği

## 6. Önerilen Teknik Yol

Bu proje için makul sonraki teknik yön:
- Veritabanı: Neon PostgreSQL
- ORM: Prisma
- Backend katmanı: ayrı `Express.js` kullanılmayacak, `Next.js` route handlers / server katmanı kullanılacak
- Auth: mevcut custom yapıyı güçlendirme veya daha standart bir auth çözümüne geçiş
- Veri erişimi: server actions veya route handlers
- Görsel yönetimi: ilk aşamada URL tabanlı, sonra upload

Not:
- Şu anki yapı demo için iyi ama production için `users.json` yaklaşımı bırakılmalı.
- Neon + Prisma birlikte kullanılacak.
- Kurulum yaklaşımı:
  - runtime için pooled `DATABASE_URL`
  - migration ve CLI için direct `DIRECT_URL`
  - Prisma schema ve istemci bu yapıya göre kurulacak

## 6.1 Storage-First Politikasi

Bu projede backend tarafındaki en önemli teknik öncelik:
- veritabanında minimum alan kaplamak

Bu yüzden uygulanacak kurallar:
- Gereksiz tablo açılmayacak.
- Gereksiz kolon tutulmayacak.
- Sonradan hesaplanabilen veriler mümkünse saklanmayacak.
- Sayaçlar mümkün oldukça sorgu ile türetilecek.
- Binary görsel/veri veritabanında tutulmayacak, yalnızca URL tutulacak.
- "İleride lazım olabilir" yaklaşımıyla alan eklenmeyecek.
- Sosyal özellikler storage maliyetine göre kademeli açılacak.

Bu kararın mevcut modele etkisi:
- `Favorite` ilişkisel tablo olarak doğru bir seçim.
- `Comment` sade tutulmalı, gereksiz metadata eklenmemeli.
- `Recipe` modeli minimum zorunlu alanlarla ilerlemeli.
- `Like` sistemi ancak gerçekten gerekirse eklenmeli.
- Takip sistemi, activity log, geniş profil metadata'sı gibi alanlar başlangıçta açılmamalı.

Pratik uygulama prensibi:
- önce `lean schema`
- sonra sadece ihtiyaç doğrulanırsa genişletme

## 7. Fazlara Bölünmüş Yol Haritası

### Faz 0 - Stabilizasyon

Amaç:
- frontend demo'yu backend'e bağlanmaya hazır hale getirmek

Yapılacaklar:
- Eksik route'ları netleştirmek
- Boş CTA'leri kapatmak veya gerçek sayfalara bağlamak
- UI'da loading / empty / error state'leri tamamlamak
- Ortak veri tiplerini ve alan isimlerini kesinleştirmek

Çıkış kriteri:
- Uygulamada “varmış gibi duran ama çalışmayan” ana akış kalmaması

### Faz 1 - Gerçek veri tabanı temeli

Amaç:
- mock veri yerine kalıcı veri modeline geçiş

Yapılacaklar:
- Prisma kurulumu
- veritabanı şeması
- migration'lar
- seed verisi
- user tablosu
- recipe tablosu
- category tablosu
- favorite / like / comment ilişkileri

Çıkış kriteri:
- Uygulama temel verilerini veritabanından okuyabiliyor olması

### Faz 2 - Auth ve kullanıcı alanı

Amaç:
- kullanıcı yönetimini üretim mantığına yaklaştırmak

Yapılacaklar:
- user kayıt / giriş akışını DB'ye taşımak
- oturum kontrolünü sağlamlaştırmak
- profil verisini gerçek backend'den beslemek
- favorileri kullanıcı bazlı kalıcı hale getirmek

Çıkış kriteri:
- yeni kullanıcı oluşturma, giriş yapma, profil görme, favori ekleme gerçek çalışıyor olması

### Faz 3 - Tarif CRUD

Amaç:
- platformun çekirdeğini açmak

Yapılacaklar:
- `Tarif Ekle` sayfası
- tarif oluşturma formu
- tarif düzenleme
- tarif silme
- malzeme ve adım yapısı

Çıkış kriteri:
- giriş yapan kullanıcı tarif oluşturup yönetebilmeli

### Faz 4 - Etkileşimler ve keşif

Amaç:
- ürün deneyimini canlı hale getirmek

Yapılacaklar:
- yorum sistemi
- beğeni sistemi
- gelişmiş filtreleme
- sıralama mantığının gerçek verilere bağlanması
- yeni eklenenler / popüler içerik alanları

Çıkış kriteri:
- ana keşif akışları gerçek verilerle çalışmalı

### Faz 5 - Üretim hazırlığı

Amaç:
- canlıya çıkış öncesi kalite

Yapılacaklar:
- testler
- güvenlik kontrolleri
- performans iyileştirmeleri
- SEO
- hata izleme
- deployment akışı

## 8. İlk Sprint Önerisi

Benim önerdiğim bir sonraki çalışma sırası:

1. Veri modeli kararını verelim
- User
- Recipe
- Category
- Ingredient
- Step
- Favorite
- Comment
- Like

2. Prisma + DB kurulumunu yapalım

3. Mock recipe yapısını veritabanına taşıyalım

4. Tarif listeleme ve detay sayfalarını gerçek veriyle çalıştırmaya başlayalım

5. Sonra auth verisini `users.json` yerine DB'ye taşıyalım

Sebep:
- Önce içerik modeli oturursa kalan tüm ekranlar daha temiz bağlanır.

## 9. Bir Sonraki Oturumda Nereden Başlayacağız?

Varsayılan başlangıç noktası:
- Bu dosyayı oku
- `Faz 0` ve `İlk Sprint Önerisi` bölümlerine göre ilerle

Eğer yeni bir karar verilmemişse bir sonraki mantıklı adım:
- veritabanı ve veri modeli tasarımını başlatmak

Ancak güncel çalışma kararı:
- Backend implementasyonuna başlamadan önce birlikte kısa bir karar oturumu yapılacak.
- Bu oturumda şu başlıklar netleştirilecek:
  - ilk backend kapsamı
  - veri modeli sınırı
  - auth yaklaşımı
  - hangi kullanıcı aksiyonlarının ilk sürüme gireceği
  - senin ve benim uygulama sırasındaki net görev dağılımımız

Backend karar oturumu:
1. İlk sürümde hangi modeller açılacak?
- Önerilen minimum: `User`, `Category`, `Recipe`, `RecipeIngredient`, `RecipeStep`, `Favorite`, `Comment`

2. İlk sürümde hangi kullanıcı aksiyonları gerçek çalışacak?
- Önerilen minimum: kayıt ol, giriş yap, çıkış yap, profil gör, tarif listele, tarif detay gör, favoriye ekle/çıkar, yorum yap

3. Auth yaklaşımı ne olacak?
- Önerilen yön: mevcut custom session mantığını Prisma + DB ile sürdürmek, sonra gerekirse standart auth çözümüne evrilmek

4. Backend yapısı nasıl kurulacak?
- Net karar: ayrı `Express.js` backend kurulmayacak, `Next.js` içindeki server katmanı kullanılacak

5. Tarif oluşturma ilk backend fazına girecek mi?
- Önerilen yön: ilk veri modeli ve okuma akışları oturduktan sonra ikinci adımda açmak

6. Görev paylaşımı nasıl işleyecek?
- Ben: Prisma, Neon bağlantısı, schema, migration, seed, veri erişimi, frontend-backend entegrasyonu
- Sen: alan kuralları, form zorunlulukları, yorum/favori davranışları, ilk sürüm kapsamı ve kabul kontrolü

## 10. Durum Notu

Şu anki net karar:
- UI demo aşaması yeterince ilerledi.
- Backend'e geçiş zamanı geldi.
- Ancak frontend'de küçük ama önemli UX kapanışları da paralel devam etmeli.
- Veritabanı ve ORM tarafında `Neon + Prisma` kullanılacak.
- Ayrı `Express.js` katmanı kurulmayacak; backend işlemleri `Next.js` içinde çözülecek.
- Backend implementasyonuna başlamadan önce kısa karar oturumu yapılacak.

## 11. Oturum Günlüğü

### 2026-05-19

Durum özeti:
- Proje incelendi.
- Uygulamanın `frontend-first demo + temel auth backend` aşamasında olduğu tespit edildi.
- UI/UX eksikleri ve backend geçiş planı çıkarıldı.
- Bu yol haritası dosyası oluşturuldu.
- UI/UX eksikleri bölümü genişletildi ve tasarım prensipleri netleştirildi.
- Aşırı border kullanılan ana yüzeylerde görsel sadeleştirme yapıldı.
- Border ağırlıklı demo görünümünü azaltmak için gölge, tonal yüzey ve hafif ring yaklaşımına geçiş başlatıldı.
- Veritabanı tercihi olarak `Neon`, ORM tercihi olarak `Prisma` kararı alındı.
- Backend'e başlamadan önce cevaplanacak karar maddeleri yol haritasına eklendi.
- Ayrı `Express.js` backend kullanılmaması, `Next.js` server katmanında kalınması kararı alındı.
- Prisma paketleri projeye eklendi.
- İlk `prisma/schema.prisma` dosyası oluşturuldu.
- Başlangıç veri modeli olarak `User`, `Category`, `Recipe`, `RecipeIngredient`, `RecipeStep`, `Favorite`, `Comment` tanımlandı.
- Prisma client kullanımını merkezileştirmek için `src/lib/prisma.js` eklendi.
- Prisma 7 yapısına uyum için `prisma.config.ts` eklendi.
- Neon runtime bağlantısı için PostgreSQL driver adapter yaklaşımı seçildi.
- İlk migration oluşturuldu ve Neon veritabanına uygulandı.
- `prisma/seed.mjs` eklendi ve ilk örnek veri seed'i Neon veritabanına basıldı.
- Seed sonucunda kategori, kullanıcı, tarif, yorum ve favori örnekleri oluşturuldu.
- `tarifler` ve `kategoriler` okuma akışı mock data yerine Prisma/Neon üzerinden çalışacak şekilde bağlandı.
- `tarif detay` okuma akışı da Prisma/Neon üzerinden çalışacak şekilde taşındı.
- Auth kullanıcı deposu `users.json` yerine Prisma `User` modeli üzerinden çalışacak şekilde taşındı.
- `favoriler` ve `profil` sayfaları gerçek veritabanı verisine bağlandı.
- Favori kaldırma işlemi için API route eklendi.
- Tarif listesi ve tarif detay ekranlarında favori ekleme/çıkarma yazma akışı veritabanına bağlandı.
- Tarif detay ekranında yorum gönderme akışı veritabanına bağlandı.
- Ana sayfa ve `yeni eklenenler` akışı veritabanı verisine bağlandı.
- `Tarif Ekle` için ilk çalışan create akışı ve API route eklendi.
- `Tarif Düzenle` ve `Tarif Sil` için ilk çalışan owner-only CRUD akışı eklendi.
- `Tarif Ekle` sonrası detay sayfasında oluşan boş `slug` kaynaklı runtime hata düzeltildi.
- Next.js 16 ile uyum için dinamik route `params` erişimleri await edilerek güvenli hale getirildi.
- `getRecipeDetail` ve `getRecipeEditData` içinde boş parametre guard'ları eklendi.
- `Tarif Düzenle` kaydet akışı transaction tabanlı hale getirildi.
- Tarif create/update/delete sonrası ilgili sayfalar için `revalidatePath` eklendi.
- Tarif formunda ağ veya sunucu hatalarının sessiz kalmaması için görünür hata mesajı eklendi.
- Tarif detay ekranındaki porsiyon arttırma/azaltma etkileşimi kaldırıldı; kullanicinin girdigi kisilik bilgisi sabit gosterilecek.
- `Kaydet` ve ayri `begeni` dili sadeleştirilerek arayüz genelinde tek `favori` akışına indirildi.
- `Gorsel URL` alanı kaldırıldı; tarif oluşturma ve düzenlemede yerel dosya yükleme akışı eklendi.
- Yüklenen görseller `public/uploads/recipes` altında saklanacak, tarif silinince veya görsel değişince eski dosya temizlenecek.

Bir sonraki önerilen iş:
- Beğeni sistemi gerekip gerekmediğini storage-first bakışla yeniden değerlendirmek ve kalan mock sayfaları temizlemek.
