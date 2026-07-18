export default {
  linkGroups: [
    [
      {
        links: ["Genel", "Gelişmiş"],
        name: "Ayarlar",
      },
      "Kasa",
      "Kayıtlar",
      "Hakkında",
    ],
    [
      ["Bağlantı", "Ayarlar"],
      ["Yayıncılar", "Ayarlar"],
      {
        links: ["Bağlantı", "Ayarlar"],
        name: "Sistem",
      },
    ],
    ["Dokümantasyon"],
    ["Kullanım Şartları", "Gizlilik Sözleşmesi"],
  ],
  tray: {
    settings: "Ayarlar",
    quit: "Çıkış",
  },
  updater: {
    checking: "Güncelleme kontrol ediliyor...",
    downloading: "Güncelleme yükleniyor...",
    loading: "Lütfen bekleyin...",
  },
  error: {
    clear: "Temizle",
  },
  reset: {
    description: "Tüm ayarları varsayılan değerlerine döndürün.",
    success: "Tüm ayarlar başarıyla sıfırlandı.",
    title: "Sıfırla",
    dialog: {
      description:
        "Tüm ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
      title: "Tüm ayarları sıfırla",
      confirm: "Evet, sıfırla",
      cancel: "Vazgeç",
    },
  },
  settings: {
    locale: {
      description: "Uygulamanın dilini seçin.",
      title: "Dil",
    },
    size: {
      description: "Overlay boyutunu ayarlayın.",
      title: "Boyut",
    },
    orientation: {
      description: "Overlay yönünü belirleyin.",
      title: "Yerleşim Yönü",
      horizontal: "Yatay",
      vertical: "Dikey",
    },
    alignment: {
      description: "Overlayın hangi yönde hizalanacağını seçin.",
      title: "Hizalama",
      right: "Sağ/Alt",
      left: "Sol/Üst",
      center: "Orta",
    },
    position: {
      description: "Overlay pozisyonunu ayarlayın.",
      quickSelect: "Hızlı Seçim",
      title: "Pozisyon",
    },
    gap: {
      title: "Aralık",
      description: "Öğelerin arasındaki boşluğu ayarlayın.",
    },
    showBackground: {
      description: "Overlaya arka plan ekleyin.",
      title: "Arka Plan",
    },
    opacity: {
      description: "Overlayin saydamlık seviyesini ayarlayın.",
      title: "Saydamlık",
    },
    radius: {
      description: "Overlay'in köşe yuvarlatma miktarını ayarlayın.",
      title: "Köşe Yuvarlaklığı",
    },
    showDrag: {
      description: "Overlayi sürüklenebilir yapın.",
      title: "Sürükleme",
    },
    showSettings: {
      description:
        "Ayarların overlay üzerinden erişilebilir olmasını sağlayın.",
      title: "Ayarlar",
    },
    autoStart: {
      description:
        "Uygulamanın sistem başlangıcında otomatik olarak başlatılmasını ayarlayın.",
      title: "Otomatik Başlat",
    },
    ignoreCursorEvents: {
      description:
        "Fare tıklamalarının overlay'in arkasındaki pencereye iletilmesini sağlayın.",
      title: "Fare Yok Sayma",
    },
    contentProtected: {
      description:
        "Uygulamanın ekran kaydı veya paylaşımı sırasında gözükmemesini sağlayın.",
      title: "Yakalama Engeli",
    },
    alwaysOnTop: {
      description: "Uygulamanın her zaman üstte olmasını sağlayın.",
      title: "Her Zaman Üstte",
    },
  },
  vault: {
    heads: ["Anahtar", "Oluşturulma Tarihi", "Güncellenme Tarihi"],
    empty: {
      description: "Kasanızda herhangi bir veri yok.",
      title: "Kasanız Boş",
    },
    clear: {
      success: "Kasadaki tüm veriler başarıyla silindi.",
      description: "Kasadaki tüm verileri silin.",
      title: "Verileri Sil",
      dialog: {
        description:
          "Kasadaki tüm verileri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
        title: "Kasadaki tüm verileri sil",
        confirm: "Evet, sil",
        cancel: "Vazgeç",
      },
    },
  },
  logs: {
    description: "Tüm kayıtları sil.",
    title: "Kayıtları Sil",
    clear: "Temizle",
    empty: {
      description: "Herhangi bir kayıt yok.",
      title: "Kayıt Yok",
    },
  },
  discord: {
    connect: {
      success: "Bağlantı başarıyla yapıldı.",
      button: "Bağlan",
    },
    disconnect: {
      description: "{username} olarak bağlanıldı.",
      success: "Bağlantı başarıyla kesildi.",
      button: "Bağlantıyı Kes",
      dialog: {
        description: "Bağlantınızı kesmek istediğinize emin misiniz?",
        deleteVaultItems: "Token verilerini kasadan sil",
        confirm: "Evet, kes",
        cancel: "Vazgeç",
        title: "Onay",
      },
    },
    show: {
      whileSpeaking: "Konuşurken",
      always: "Her Zaman",
      never: "Gösterme",
    },
    showGuild: {
      description:
        "Sunucu adı, sunucu ikonu ve kanal adı overlay'de görünüp görünmeyeceğini ayarlayın.",
      title: "Sunucu Bilgisini Göster",
    },
    showGuildIconAnimated: {
      description:
        "Sunucu ikonunun animasyonlu gösterilip gösterilmeyeceğini ayarlayın.",
      title: "Sunucu İkonu Animasyonu",
    },
    showMe: {
      description: "Kendinizin gösterilip gösterilmeyeceğini ayarlayın.",
      title: "Beni Göster",
    },
    showMutedUsers: {
      description:
        "Sessiz kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
      title: "Sessiz Kullanıcıları Göster",
    },
    showDeafenedUsers: {
      description:
        "Sağır kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
      title: "Sağır Kullanıcıları Göster",
    },
    showBots: {
      description:
        "Bot kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
      title: "Botları Göster",
    },
    showSpeakersOnly: {
      description: "Sadece konuşanların gözükmesini sağlayın.",
      title: "Sadece Konuşanları Göster",
    },
    userLimit: {
      description:
        "Gösterilecek maksimum kullanıcı sayısını ayarlayın. (0 = limitsiz)",
      title: "Kullanıcı Sınırı",
    },
    showDisplayName: {
      description: "Kullanıcı adının ne zaman gözükeceğini seçin.",
      title: "Ad Gösterimi",
    },
    showAvatarAnimated: {
      description: "Avatarın ne zaman animasyonlu gözükeceğini seçin.",
      title: "Avatar Animasyonu",
    },
    displayName: {
      description: "Kullanıcının hangi adının gözükeceğini seçin.",
      username: "Kullanıcı Adı",
      title: "Gösterilecek Ad",
      nick: "Sunucu Takma Adı",
      globalName: "Görünen Ad",
    },
  },
  kick: {
    addChannel: {
      alreadyAdded: "Bu kullanıcı adı zaten listede.",
      invalid: "Geçerli bir kullanıcı adı girin.",
      success: "Yayıncılar başarıyla kaydedildi.",
      placeholder: "Yayıncı kullanıcı adı",
      empty: "Kullanıcı adı girin.",
      save: "Kaydet",
    },
    empty: {
      description: "Henüz bir yayıncı eklemediniz.",
      title: "Yayıncı Yok",
    },
    show: {
      whileLive: "Yayındayken",
      always: "Her Zaman",
      never: "Asla",
    },
    showOnlyLive: {
      description: "Sadece canlı yayında olanların gözükmesini sağlayın.",
      title: "Sadece Yayında Olanları Göster",
    },
    showDisplayName: {
      description: "Yayıncı adının ne zaman gözükeceğini seçin.",
      title: "Ad Gösterimi",
    },
    displayName: {
      description: "Yayıncının hangi adının gözükeceğini seçin.",
      title: "Gösterilecek Ad",
      slug: "Kanal Slug'ı",
      name: "Yayıncı Adı",
    },
    showCategory: {
      description: "Yayının kategorisinin ne zaman gözükeceğini seçin.",
      title: "Yayın Kategorisini Göster",
    },
    streamerLimit: {
      description: "En fazla kaç tane yayıncı gözükeceğini seçin.",
      title: "Yayıncı Limiti",
    },
  },
  system: {
    showCpu: {
      description: "CPU kullanımının gözükmesini sağlayın.",
      title: "CPU Kullanımını Göster",
    },
    showMemory: {
      description: "Bellek kullanımının gözükmesini sağlayın.",
      title: "Bellek Kullanımını Göster",
    },
    showNetwork: {
      description: "Ağ kullanımının gözükmesini sağlayın.",
      title: "Ağ Kullanımını Göster",
    },
    showBattery: {
      description: "Batarya durumunun gözükmesini sağlayın.",
      title: "Batarya Durumunu Göster",
    },
  },
  stream: {
    watchOnKick: "Kick'te İzle",
  },
};
