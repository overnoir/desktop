export default {
  navbar: {
    linkGroups: [
      {
        name: "Genel",
        links: ["Ana Sayfa", "Ayarlar"],
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
  settings: {
    advanced: "Gelişmiş",
    general: "Genel",
    theme: {
      title: "Tema",
      description: "Uygulamanın görünüm temasını özelleştirin.",
      system: "Sistem",
      light: "Açık",
      dark: "Koyu",
    },
    autoStart: {
      title: "Otomatik Başlat",
      description:
        "Uygulamanın sistem başlangıcında otomatik olarak başlatılmasını ayarlayın.",
    },
    preventCapture: {
      title: "Yakalama Engeli",
      description:
        "Uygulamanın diğer uygulamalar tarafından yakalanmasını engeller (örneğin ekran kaydı uygulamaları).",
    },
    locale: {
      title: "Dil",
      description: "Uygulama arayüz dilini seçin.",
    },
    isDraggable: {
      title: "Sürükleme",
      description: "Uygulamanın sürüklenebilir olup olmadığını belirleyin.",
    },
    showBackground: {
      title: "Arka Plan",
      description: "Uygulamanın arka plan görüntüsünü etkinleştirin.",
    },
    ignoreCursor: {
      title: "Fare Yok Sayma",
      description:
        "Overlayın fareyi yoksaymasını sağlayın (fare eylemlerinin overlayın arkasına geçmesini sağlar).",
    },
    showSettings: {
      title: "Ayarlar",
      description:
        "Ayarların görüntülenmesini etkinleştirin veya devre dışı bırakın.",
    },
    opacity: {
      title: "Saydamlık",
      description: "Uygulama arayüzünün saydamlık seviyesini ayarlayın.",
    },
    size: {
      title: "Boyut",
      description: "Uygulama boyutunu ayarlayın.",
    },
    radius: {
      title: "Köşe Yuvarlaklığı",
      description: "Uygulama köşelerinin yuvarlaklık seviyesini ayarlayın.",
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
    reset: {
      title: "Sıfırla",
      description: "Uygulamanın tüm ayarlarını varsayılan ayarlarına döndürün.",
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
};
