export default {
  meta: {
    home: {
      description: "Uygulamanın genel durumunu görüntüleyin.",
      title: "Ana Sayfa",
    },
    settings: {
      description: "Uygulama ayarlarını yapılandırın ve yönetin.",
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
      list: ["Açık", "Koyu", "Sistem"],
    },
    drag: {
      title: "Sürükleme",
      description: "Uygulamanın sürüklenebilir olup olmadığını belirleyin.",
    },
    opacity: {
      title: "Saydamlık",
      description: "Uygulama arayüzünün saydamlık seviyesini ayarlayın.",
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
