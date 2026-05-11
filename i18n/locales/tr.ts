export default {
  meta: {
    home: {
      title: "Ana Sayfa",
    },
    settings: {
      title: "Ayarlar",
    },
  },
  navbar: {
    linkGroups: [
      {
        name: "Genel",
        links: ["Ana Sayfa", "Ayarlar"],
      },
      {
        name: "Bağlantılar",
        links: ["Discord", "Kick", "Steam"],
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
    drag: {
      title: "Sürükleme",
      description: "Uygulamanın sürüklenebilir olup olmadığını belirleyin.",
    },
    background: {
      title: "Arka Plan",
      description: "Uygulamanın arka plan görüntüsünü etkinleştirin.",
    },
    opacity: {
      title: "Saydamlık",
      description: "Uygulama arayüzünün saydamlık seviyesini ayarlayın.",
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
