export default {
  linkGroups: [
    {
      name: "GENEL",
      links: [
        {
          name: "Ayarlar",
          links: ["Genel", "Gelişmiş"],
        },
        "Kasa",
        "Hatalar",
        "Yardım",
      ],
    },
    {
      name: "BAĞLANTILAR",
      links: [
        {
          links: ["Bağlantı", "Ayarlar"],
        },
        {
          links: ["Yayıncılar", "Ayarlar"],
        },
        {
          name: "Sistem",
          links: ["Bağlantı", "Ayarlar"],
        },
      ],
    },
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
    goHome: "Ana Sayfaya Git",
  },
  settings: {
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
  vault: {
    heads: ["Anahtar", "Oluşturulma Tarihi", "Güncellenme Tarihi"],
    empty: {
      title: "Kasanız Boş",
      description: "Kasanızda herhangi bir veri yok.",
    },
    clear: {
      title: "Verileri Sil",
      description: "Kasadaki tüm verileri silin.",
      success: "Kasadaki tüm veriler başarıyla silindi.",
      dialog: {
        title: "Kasadaki tüm verileri sil",
        description:
          "Kasadaki tüm verileri istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sil",
        cancel: "Vazgeç",
      },
    },
  },
  errors: {
    title: "Hata Kayıtları",
    description: "Uygulamada oluşan hatalar.",
    clear: "Hepsini Sil",
    empty: {
      title: "Her Şey Yolunda",
      description: "Herhangi bir hata yok.",
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
  discord: {
    connect: {
      success: "Bağlantı başarıyla yapıldı.",
      description: "Bağlanmak için Discord sizden onay isteyecek.",
      button: "Bağlan",
    },
    disconnect: {
      success: "Bağlantı başarıyla kesildi.",
      description: "{username} olarak bağlanıldı.",
      button: "Bağlantıyı Kes",
      dialog: {
        title: "Discord RPC Bağlantısını Kes",
        description: "Discord bağlantınızı kesmek istediğinize emin misiniz?",
        deleteVaultItems: "Token verilerini kasadan sil",
        confirm: "Evet, kes",
        cancel: "Vazgeç",
      },
    },
    show: {
      always: "Her Zaman",
      whileSpeaking: "Konuşurken",
      never: "Gösterme",
    },
    showGuild: {
      title: "Sunucu Bilgisini Göster",
      description:
        "Sunucu adı, sunucu iconu ve kanal adı overlay'de görünüp görünmeyeceğini ayarlayın.",
    },
    showGuildIconAnimated: {
      title: "Sunucu İkonu Animasyonu",
      description:
        "Sunucu ikonunun animasyonlu gösterilip gösterilmeyeceğini ayarlayın.",
    },
    showMe: {
      title: "Beni Göster",
      description: "Kendinizin görünüp görünmeyeceğini ayarlayın.",
    },
    showMutedUsers: {
      title: "Sessiz Kullanıcıları Göster",
      description:
        "Sessiz kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
    },
    showDeafenedUsers: {
      title: "Sağır Kullanıcıları Göster",
      description:
        "Sağır kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
    },
    showBots: {
      title: "Botları Göster",
      description:
        "Bot kullanıcıların overlay'de görünüp görünmeyeceğini ayarlayın.",
    },
    showSpeakersOnly: {
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
    showAvatarAnimated: {
      title: "Avatar Animasyonu",
      description: "Avatarın ne zaman animasyonlu gözükeceğini seçin.",
    },
    displayName: {
      title: "Gösterilecek Ad",
      description: "Kullanıcının hangi adının gözükeceğini seçin.",
      username: "Kullanıcı Adı",
      nick: "Sunucu Takma Adı",
      globalName: "Görünen Ad",
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
  kick: {
    addChannel: {
      placeholder: "Yayıncı kullanıcı adı",
      empty: "Kullanıcı adı giriniz.",
      invalid: "Geçerli bir kullanıcı adı giriniz.",
      alreadyAdded: "Bu kullanıcı adı zaten listede.",
      success: "Yayıncılar başarıyla kaydedildi.",
      save: "Kaydet",
    },
    empty: {
      title: "Yayıncı Yok",
      description: "Henüz bir yayıncı eklemediniz.",
    },
    show: {
      whileLive: "Yayındayken",
      always: "Her Zaman",
      never: "Asla",
    },
    showOnlyLive: {
      title: "Sadece Yayında Olanları Göster",
      description: "Sadece canlı yayında olanların gözükmesini sağlayın.",
    },
    showDisplayName: {
      title: "Ad Gösterimi",
      description: "Yayıncı adının ne zaman gözükeceğini seçin.",
    },
    displayName: {
      title: "Gösterilecek Ad",
      description: "Yayıncının hangi adının gözükeceğini seçin.",
      name: "Yayıncı Adı",
      slug: "Kanal Slug'ı",
    },
    showCategory: {
      title: "Yayın Kategorisini Göster",
      description: "Yayının kategorisinin ne zaman gözükeceğini seçin.",
    },
    streamerLimit: {
      title: "Yayıncı Limiti",
      description: "En fazla kaç tane yayıncı gözükeceğini seçin.",
    },
    reset: {
      title: "Sıfırla",
      description: "Tüm Kick ayarlarını varsayılan ayarlarına döndürün.",
      success: "Tüm Kick ayarları başarıyla sıfırlandı.",
      dialog: {
        title: "Tüm Kick ayarlarını sıfırla",
        description:
          "Tüm Kick ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sıfırla",
        cancel: "Vazgeç",
      },
    },
  },
  system: {
    connect: {
      success: "Bağlantı başarıyla yapıldı.",
      button: "Bağlan",
    },
    disconnect: {
      success: "Bağlantı başarıyla kesildi.",
      button: "Bağlantıyı Kes",
    },
    showCpu: {
      title: "CPU Kullanımını Göster",
      description: "CPU kullanımının gözükmesini sağlayın.",
    },
    showMemory: {
      title: "RAM Kullanımını Göster",
      description: "RAM kullanımının gözükmesini sağlayın.",
    },
    showNetwork: {
      title: "Ağ Kullanımını Göster",
      description: "Ağ kullanımının gözükmesini sağlayın.",
    },
    showBattery: {
      title: "Batarya Durumunu Göster",
      description: "Batarya durumunun gözükmesini sağlayın.",
    },
    reset: {
      title: "Sıfırla",
      description: "Tüm Sistem ayarlarını varsayılan ayarlarına döndürün.",
      success: "Tüm Sistem ayarları başarıyla sıfırlandı.",
      dialog: {
        title: "Tüm Sistem ayarlarını sıfırla",
        description:
          "Tüm Sistem ayarlarınızı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
        confirm: "Evet, sıfırla",
        cancel: "Vazgeç",
      },
    },
  },
  stream: {
    watchOnKick: "Kickde İzle",
  },
};
