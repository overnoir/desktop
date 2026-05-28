export default {
  navbar: {
    linkGroups: [
      {
        name: "Genel",
        links: ["Ana Sayfa", "Kasa", "Yardım"],
      },
      {
        name: "Ayarlar",
        links: ["Arayüz", "Gelişmiş"],
      },
      {
        name: "Bağlantılar",
      },
    ],
  },
  tray: {
    settings: "Ayarlar",
    quit: "Çıkış",
  },
  updater: {
    checking: "Güncelleme kontrol ediliyor...",
    downloading: "Güncelleme yükleniyor...",
  },
  settings: {
    interface: {
      theme: {
        title: "Tema",
        description: "Uygulamanın görünüm temasını özelleştirin.",
        system: "Sistem",
        light: "Açık",
        dark: "Koyu",
      },
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
      position: {
        title: "Pozisyon",
        description: "Uygulama pozisyonunu ayarlayın.",
        quickSelect: "Hızlı Seçim",
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
    },
    advanced: {
      isDraggable: {
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
      reset: {
        title: "Sıfırla",
        description:
          "Uygulamanın tüm ayarlarını varsayılan ayarlarına döndürün.",
        success: "Tüm ayarlar başarıyla sıfırlandı.",
        dialog: {
          title: "Tüm ayarları sıfırla",
          description:
            "Tüm ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
          confirm: "Evet, sıfırla",
          cancel: "Vazgeç",
        },
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
    empty: "Kasanız boş.",
  },
};
