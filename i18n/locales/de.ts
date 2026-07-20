export default {
  linkGroups: [
    [
      {
        links: ["Allgemein", "Erweitert"],
        name: "Einstellungen",
      },
      "Tresor",
      "Protokolle",
      "Über",
    ],
    [
      ["Verbindung", "Einstellungen"],
      ["Verbindung", "Einstellungen"],
      {
        links: ["Verbindung", "Einstellungen"],
        name: "System",
      },
    ],
    ["Dokumentation"],
    ["Nutzungsbedingungen", "Datenschutzerklärung"],
  ],
  tray: {
    settings: "Einstellungen",
    quit: "Beenden",
  },
  updater: {
    checking: "Suche nach Updates...",
    downloading: "Update wird heruntergeladen...",
    loading: "Bitte warten...",
  },
  error: {
    clear: "Löschen",
  },
  reset: {
    description: "Alle Einstellungen auf die Standardwerte zurücksetzen.",
    success: "Alle Einstellungen wurden erfolgreich zurückgesetzt.",
    title: "Zurücksetzen",
    dialog: {
      description:
        "Möchten Sie wirklich alle Einstellungen zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.",
      title: "Alle Einstellungen zurücksetzen",
      confirm: "Ja, zurücksetzen",
      cancel: "Abbrechen",
    },
  },
  settings: {
    locale: {
      description: "Wählen Sie die Anwendungssprache.",
      title: "Sprache",
    },
    size: {
      description: "Passen Sie die Overlay-Größe an.",
      title: "Größe",
    },
    orientation: {
      description: "Wählen Sie die Overlay-Ausrichtung.",
      title: "Ausrichtung",
      horizontal: "Horizontal",
      vertical: "Vertikal",
    },
    alignment: {
      description: "Wählen Sie die Ausrichtung des Overlays.",
      title: "Ausrichtung",
      right: "Rechts/Unten",
      left: "Links/Oben",
      center: "Mitte",
    },
    position: {
      description: "Passen Sie die Overlay-Position an.",
      quickSelect: "Schnellauswahl",
      title: "Position",
    },
    gap: {
      title: "Abstand",
      description: "Passen Sie den Abstand zwischen den Elementen an.",
    },
    showBackground: {
      description: "Fügen Sie dem Overlay einen Hintergrund hinzu.",
      title: "Hintergrund",
    },
    opacity: {
      description: "Passen Sie die Transparenz des Overlays an.",
      title: "Deckkraft",
    },
    radius: {
      description: "Passen Sie die Abrundung der Ecken des Overlays an.",
      title: "Eckenradius",
    },
    showDrag: {
      description: "Machen Sie das Overlay verschiebbar.",
      title: "Ziehpunkt",
    },
    showSettings: {
      description: "Machen Sie die Einstellungen über das Overlay zugänglich.",
      title: "Einstellungen",
    },
    autoStart: {
      description: "Starten Sie die Anwendung automatisch beim Systemstart.",
      title: "Autostart",
    },
    ignoreCursorEvents: {
      description:
        "Lassen Sie Mausklicks durch das Overlay hindurch zu den dahinterliegenden Fenstern durch.",
      title: "Cursor ignorieren",
    },
    contentProtected: {
      description:
        "Verhindern Sie, dass die Anwendung bei Bildschirmaufnahmen oder -freigaben angezeigt wird.",
      title: "Aufnahmeschutz",
    },
    alwaysOnTop: {
      description: "Halten Sie die Anwendung immer im Vordergrund.",
      title: "Immer im Vordergrund",
    },
  },
  vault: {
    heads: ["Schlüssel", "Erstellungsdatum", "Änderungsdatum"],
    empty: {
      description: "Es befinden sich keine Daten in Ihrem Tresor.",
      title: "Tresor ist leer",
    },
    clear: {
      success: "Alle Tresordaten wurden erfolgreich gelöscht.",
      description: "Löschen Sie alle Daten im Tresor.",
      title: "Daten löschen",
      dialog: {
        description:
          "Möchten Sie wirklich alle Tresordaten löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        title: "Alle Tresordaten löschen",
        confirm: "Ja, löschen",
        cancel: "Abbrechen",
      },
    },
  },
  logs: {
    description: "Alle Protokolle löschen.",
    title: "Protokolle löschen",
    clear: "Löschen",
    empty: {
      description: "Keine Protokolle vorhanden.",
      title: "Keine Protokolle",
    },
  },
  discord: {
    connect: {
      description:
        "Verbinden, um die Sprachkanal-Aktivität im Overlay zu sehen.",
      clientId: {
        description: "Wie kann ich eine Client-ID erhalten?",
        placeholder: "Anwendungs-Client-ID",
      },
      success: "Erfolgreich verbunden.",
      button: "Verbinden",
    },
    disconnect: {
      description: "Verbunden als {username}.",
      success: "Erfolgreich getrennt.",
      button: "Trennen",
      dialog: {
        description: "Möchten Sie die Verbindung wirklich trennen?",
        deleteVaultItems: "Token-Daten aus dem Tresor entfernen",
        confirm: "Ja, trennen",
        cancel: "Abbrechen",
        title: "Bestätigen",
      },
    },
    show: {
      whileSpeaking: "Beim Sprechen",
      always: "Immer",
      never: "Nie",
    },
    showGuild: {
      description:
        "Wählen Sie, ob Servername, Icon und Kanalname im Overlay angezeigt werden.",
      title: "Server-Info anzeigen",
    },
    showGuildIconAnimated: {
      description: "Wählen Sie, ob das Server-Icon animiert angezeigt wird.",
      title: "Server-Icon-Animation",
    },
    showMe: {
      description: "Wählen Sie, ob Sie selbst im Overlay angezeigt werden.",
      title: "Mich anzeigen",
    },
    showMutedUsers: {
      description:
        "Wählen Sie, ob stummgeschaltete Benutzer im Overlay angezeigt werden.",
      title: "Stummgeschaltete Benutzer anzeigen",
    },
    showDeafenedUsers: {
      description:
        "Wählen Sie, ob taubgeschaltete Benutzer im Overlay angezeigt werden.",
      title: "Taubgeschaltete Benutzer anzeigen",
    },
    showBots: {
      description: "Wählen Sie, ob Bots im Overlay angezeigt werden.",
      title: "Bots anzeigen",
    },
    showSpeakersOnly: {
      description: "Nur sprechende Benutzer anzeigen.",
      title: "Nur Sprecher anzeigen",
    },
    userLimit: {
      description:
        "Legen Sie die maximale Anzahl der angezeigten Benutzer fest. (0 = unbegrenzt)",
      title: "Benutzerlimit",
    },
    showDisplayName: {
      description: "Wählen Sie, wann der Benutzername angezeigt wird.",
      title: "Namensanzeige",
    },
    showAvatarAnimated: {
      description: "Wählen Sie, wann der Avatar animiert angezeigt wird.",
      title: "Avatar-Animation",
    },
    displayName: {
      description:
        "Wählen Sie, welcher Name für Benutzer angezeigt werden soll.",
      username: "Benutzername",
      title: "Anzeigename",
      nick: "Server-Spitzname",
      globalName: "Anzeigename",
    },
  },
  kick: {
    addStreamer: {
      alreadyAdded: "Dieser Benutzername ist bereits in der Liste.",
      invalid: "Bitte geben Sie einen gültigen Benutzernamen ein.",
      success: "Streamer erfolgreich gespeichert.",
      placeholder: "Streamer-Benutzername",
      empty: "Bitte geben Sie einen Benutzernamen ein.",
      save: "Speichern",
    },
    empty: {
      description: "Sie haben noch keine Streamer hinzugefügt.",
      title: "Keine Streamer",
    },
    show: {
      whileLive: "Beim Live-Stream",
      always: "Immer",
      never: "Nie",
    },
    showOnlyLive: {
      description: "Nur Streamer anzeigen, die gerade live sind.",
      title: "Nur Live anzeigen",
    },
    showDisplayName: {
      description: "Wählen Sie, wann der Streamer-Name angezeigt wird.",
      title: "Namensanzeige",
    },
    displayName: {
      description:
        "Wählen Sie, welcher Name für Streamer angezeigt werden soll.",
      title: "Anzeigename",
      slug: "Kanal-Slug",
      name: "Streamer-Name",
    },
    showCategory: {
      description: "Wählen Sie, wann die Stream-Kategorie angezeigt wird.",
      title: "Stream-Kategorie anzeigen",
    },
    streamerLimit: {
      description:
        "Legen Sie die maximale Anzahl der angezeigten Streamer fest.",
      title: "Streamer-Limit",
    },
  },
  system: {
    showCpu: {
      description: "CPU-Auslastung anzeigen.",
      title: "CPU-Auslastung anzeigen",
    },
    showMemory: {
      description: "Speicherauslastung anzeigen.",
      title: "Speicherauslastung anzeigen",
    },
    showNetwork: {
      description: "Netzwerkauslastung anzeigen.",
      title: "Netzwerkauslastung anzeigen",
    },
    showBattery: {
      description: "Akkustatus anzeigen.",
      title: "Akkustatus anzeigen",
    },
  },
  stream: {
    watchOnKick: "Auf Kick ansehen",
  },
};
