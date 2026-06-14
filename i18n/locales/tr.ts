export default {
  linkGroups: [
    {
      name: "GENEL",
      links: ["Ana Sayfa", "Kasa", "Ayarlar"],
    },
    {
      name: "BAĞLANTILAR",
    },
    {
      links: ["Yardım"],
    },
  ],
  tray: {
    settings: "Ayarlar",
    quit: "Çıkış",
  },
  updater: {
    checking: "Güncelleme kontrol ediliyor...",
    downloading: "Güncelleme yükleniyor...",
  },
  error: {
    goHome: "Ana Sayfaya Git",
  },
  settings: {
    tabs: ["Genel", "Gelişmiş"],
    locale: {
      title: "Dil",
      description: "Uygulama arayüz dilini seçin.",
    },
    size: {
      title: "Boyut",
      description: "Uygulama boyutunu ayarlayın.",
    },
    orientation: {
      title: "Yerleşim Yönü",
      description: "Uygulama düzeninin yönünü belirleyin.",
      horizontal: "Yatay",
      vertical: "Dikey",
    },
    alignment: {
      title: "Hizalama",
      description: "Overlayın hangi yönde hizalanacağını seçin.",
      left: "Sol/Üst",
      center: "Orta",
      right: "Sağ/Alt",
    },
    position: {
      title: "Pozisyon",
      description: "Uygulama pozisyonunu ayarlayın.",
      quickSelect: "Hızlı Seçim",
    },
    gap: {
      title: "Aralık",
      description: "Elementlerin aralarındaki boşluğu ayarlayın.",
    },
    showBackground: {
      title: "Arka Plan",
      description: "Uygulamanın arka plan görüntüsünü etkinleştirin.",
    },
    opacity: {
      title: "Saydamlık",
      description: "Uygulama arayüzünün saydamlık seviyesini ayarlayın.",
    },
    radius: {
      title: "Köşe Yuvarlaklığı",
      description: "Uygulama köşelerinin yuvarlaklık seviyesini ayarlayın.",
    },
    showDrag: {
      title: "Sürükleme",
      description: "Uygulamanın sürüklenebilir olup olmadığını belirleyin.",
    },
    showSettings: {
      title: "Ayarlar",
      description:
        "Ayarların görüntülenmesini etkinleştirin veya devre dışı bırakın.",
    },
    autoStart: {
      title: "Otomatik Başlat",
      description:
        "Uygulamanın sistem başlangıcında otomatik olarak başlatılmasını ayarlayın.",
    },
    ignoreCursor: {
      title: "Fare Yok Sayma",
      description:
        "Overlayın fareyi yoksaymasını sağlayın (fare eylemlerinin overlayın arkasına geçmesini sağlar).",
    },
    preventCapture: {
      title: "Yakalama Engeli",
      description:
        "Uygulamanın diğer uygulamalar tarafından yakalanmasını engeller (örneğin ekran kaydı uygulamaları).",
    },
    alwaysOnTop: {
      title: "Her Zaman Üstte",
      description: "Overlayın her zaman üstte olup olmayacağını ayarlayın.",
    },
    reset: {
      title: "Sıfırla",
      description: "Tüm uygulama ayarlarını varsayılan ayarlarına döndürün.",
      success: "Tüm uygulama ayarları başarıyla sıfırlandı.",
      dialog: {
        title: "Tüm uygulama ayarlarını sıfırla",
        description:
          "Tüm uygulama ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sıfırla",
        cancel: "Vazgeç",
      },
    },
  },
  help: {
    docs: {
      title: "Dokümantasyon",
      description:
        "Uygulama hakkında çoğu bilgiyi dokümantasyonda bulabilirsiniz.",
    },
    discord: {
      description:
        "Discord sunucumuza katılarak yardım alabilir, önerilerde bulunabilir, hata bildirebilir ve yeniliklerden haberdar olabilirsiniz.",
    },
  },
  vault: {
    heads: ["Anahtar", "Oluşturulma Tarihi", "Güncellenme Tarihi"],
    error: "Kasa verileri yüklenirken bir hata oluştu.",
    empty: {
      title: "Kasanız Boş",
      description: "Kasanızda herhangi bir veri yok.",
    },
    clear: {
      title: "Verileri Sil",
      description: "Kasadaki tüm verileri silin.",
      success: "Kasadaki tüm veriler başarıyla silindi.",
      error: "Kasa verileri silinirken bir hata oluştu.",
      dialog: {
        title: "Kasadaki tüm verileri sil",
        description:
          "Kasadaki tüm verileri istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sil",
        cancel: "Vazgeç",
      },
    },
  },
  discord: {
    tabs: ["Bağlantı", "Ayarlar", "Hatalar"],
    errors: {
      title: "Hatalar",
      description: "Discord RPC hata geçmişi.",
      clear: "Hepsini Sil",
      empty: {
        title: "Her Şey Yolunda",
        description: "Herhangi bir hata yok.",
      },
    },
    connect: {
      success: "Bağlantı başarıyla yapıldı.",
      error: "Bağlantı yapılırken bir sorun oluştu.",
      description: "Bağlanmak için Discord sizden onay isteyecek.",
      button: "Bağlan",
    },
    disconnect: {
      success: "Bağlantı başarıyla kesildi.",
      error: "Bağlantı kesilirken bir sorun oluştu.",
      description: "{username} olarak bağlanıldı.",
      button: "Bağlantıyı Kes",
    },
    show: {
      whileSpeaking: "Konuşurken",
      always: "Her Zaman",
      never: "Gösterme",
    },
    showGuild: {
      title: "Sunucu Bilgisini Göster",
      description:
        "Sunucu adı, sunucu iconu ve kanal adı overlay'de görünüp görünmeyeceğini ayarlayın.",
    },
    showMe: {
      title: "Beni Göster",
      description: "Kendinizin görünüp görünmeyeceğini ayarlayın.",
    },
    showOnlySpeakers: {
      title: "Sadece Konuşanları Göster",
      description: "Sadece konuşanların gözükmesini sağlayın.",
    },
    userLimit: {
      title: "Kullanıcı Sınırı",
      description:
        "Gösterilecek maksimum kullanıcı sayısını ayarlayın. (0 = limitsiz)",
    },
    showDisplayName: {
      title: "Ad Gösterimi",
      description: "Kullanıcı adının ne zaman gözükeceğini seçin.",
    },
    showAvatarDecoration: {
      title: "Avatar Dekorasyonu",
      description: "Avatar dekorasyonun ne zaman gözükeceğini seçin.",
    },
    showAvatarDecorationAnimated: {
      title: "Avatar Dekorasyon Animasyonu",
      description:
        "Avatar dekorasyonun ne zaman animasyonlu gözükeceğini seçin.",
    },
    showAvatarAnimated: {
      title: "Avatar Animasyonu",
      description: "Avatarın ne zaman animasyonlu gözükeceğini seçin.",
    },
    displayName: {
      title: "Gösterilecek Ad",
      description: "Kullanıcının hangi adının gözükeceğini seçin.",
      username: "Kullanıcı Adı",
      nick: "Görünen Ad",
    },
    reset: {
      title: "Sıfırla",
      description: "Tüm Discord ayarlarını varsayılan ayarlarına döndürün.",
      success: "Tüm Discord ayarları başarıyla sıfırlandı.",
      dialog: {
        title: "Tüm Discord ayarlarını sıfırla",
        description:
          "Tüm Discord ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sıfırla",
        cancel: "Vazgeç",
      },
    },
  },
};
