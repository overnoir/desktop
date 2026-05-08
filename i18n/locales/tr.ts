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
    theme: {
      title: "Tema",
      description: "Uygulamanın görünüm temasını özelleştirin.",
      list: ["Sistem", "Koyu", "Açık"],
    },
    drag: {
      title: "Sürükleme",
      description: "Uygulamanın sürüklenebilir olup olmadığını belirleyin.",
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
      list: ["Yatay", "Dikey"],
    },
    position: {
      title: "Pozisyon",
      description: "Uygulama pozisyonunu ayarlayın.",
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
