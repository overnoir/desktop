export default {
  linkGroups: [
    [
      {
        links: ["Général", "Avancé"],
        name: "Paramètres",
      },
      "Coffre-fort",
      "Journaux",
      "À propos",
    ],
    [
      ["Connexion", "Paramètres"],
      ["Connexion", "Paramètres"],
      {
        links: ["Connexion", "Paramètres"],
        name: "Système",
      },
    ],
    ["Documentation"],
    ["Conditions d'utilisation", "Politique de confidentialité"],
  ],
  tray: {
    settings: "Paramètres",
    quit: "Quitter",
  },
  updater: {
    checking: "Recherche de mises à jour...",
    available: "Mise à jour disponible",
    version: "Version {version}",
    install: "Installer la mise à jour",
    downloading: "Téléchargement de la mise à jour...",
  },
  error: {
    clear: "Effacer",
  },
  reset: {
    description:
      "Réinitialiser tous les paramètres à leurs valeurs par défaut.",
    success: "Tous les paramètres ont été réinitialisés avec succès.",
    title: "Réinitialiser",
    dialog: {
      description:
        "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.",
      title: "Réinitialiser tous les paramètres",
      confirm: "Oui, réinitialiser",
      cancel: "Annuler",
    },
  },
  settings: {
    locale: {
      description: "Sélectionnez la langue de l'application.",
      title: "Langue",
    },
    size: {
      description: "Ajustez la taille de l'overlay.",
      title: "Taille",
    },
    orientation: {
      description: "Choisissez l'orientation de l'overlay.",
      title: "Orientation",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    alignment: {
      description: "Choisissez l'alignement de l'overlay.",
      title: "Alignement",
      right: "Droite/Bas",
      left: "Gauche/Haut",
      center: "Centre",
    },
    position: {
      description: "Ajustez la position de l'overlay.",
      quickSelect: "Sélection rapide",
      title: "Position",
    },
    gap: {
      title: "Écart",
      description: "Ajustez l'espacement entre les éléments.",
    },
    showBackground: {
      description: "Ajoutez un arrière-plan à l'overlay.",
      title: "Arrière-plan",
    },
    opacity: {
      description: "Ajustez le niveau de transparence de l'overlay.",
      title: "Opacité",
    },
    radius: {
      description: "Ajustez l'arrondi des coins de l'overlay.",
      title: "Rayon des coins",
    },
    showDrag: {
      description: "Rendez l'overlay déplaçable.",
      title: "Poignée de déplacement",
    },
    showSettings: {
      description: "Rendez les paramètres accessibles depuis l'overlay.",
      title: "Paramètres",
    },
    autoStart: {
      description:
        "Lancez l'application automatiquement au démarrage du système.",
      title: "Démarrage automatique",
    },
    ignoreCursorEvents: {
      description:
        "Laissez les clics de souris traverser l'overlay vers les fenêtres en arrière-plan.",
      title: "Ignorer le curseur",
    },
    contentProtected: {
      description:
        "Empêchez l'application d'apparaître dans les enregistrements ou partages d'écran.",
      title: "Protection de capture",
    },
    alwaysOnTop: {
      description: "Gardez l'application toujours au premier plan.",
      title: "Toujours au premier plan",
    },
    update: {
      description: "Mettez à jour l'application vers la dernière version.",
      title: "Mise à jour",
      button: "Mettre à jour",
      alreadyLatest: "L'application est déjà à la dernière version.",
    },
  },
  vault: {
    heads: ["Clé", "Date de création", "Date de modification"],
    empty: {
      description: "Il n'y a aucune donnée dans votre coffre-fort.",
      title: "Coffre-fort vide",
    },
    clear: {
      success:
        "Toutes les données du coffre-fort ont été supprimées avec succès.",
      description: "Supprimez toutes les données du coffre-fort.",
      title: "Supprimer les données",
      dialog: {
        description:
          "Êtes-vous sûr de vouloir supprimer toutes les données du coffre-fort ? Cette action est irréversible.",
        title: "Supprimer toutes les données du coffre-fort",
        confirm: "Oui, supprimer",
        cancel: "Annuler",
      },
    },
  },
  logs: {
    clear: "Effacer",
    open: "Ouvrir",
    empty: {
      description: "Aucun journal disponible.",
      title: "Aucun journal",
    },
  },
  discord: {
    connect: {
      description:
        "Connectez-vous pour voir l'activité du canal vocal sur l'overlay.",
      clientId: {
        description: "Comment puis-je obtenir un Client ID ?",
        placeholder: "ID Client de l'application",
      },
      success: "Connecté avec succès.",
      button: "Se connecter",
    },
    disconnect: {
      description: "Connecté en tant que {username}.",
      success: "Déconnecté avec succès.",
      button: "Se déconnecter",
      dialog: {
        description: "Êtes-vous sûr de vouloir vous déconnecter ?",
        deleteVaultItems: "Supprimer les données de jeton du coffre-fort",
        confirm: "Oui, déconnecter",
        cancel: "Annuler",
        title: "Confirmer",
      },
    },
    show: {
      whileSpeaking: "En parlant",
      always: "Toujours",
      never: "Jamais",
    },
    showGuild: {
      description:
        "Choisissez si le nom du serveur, l'icône et le nom du canal apparaissent sur l'overlay.",
      title: "Afficher les infos du serveur",
    },
    showGuildIconAnimated: {
      description: "Choisissez si l'icône du serveur apparaît en animation.",
      title: "Animation de l'icône du serveur",
    },
    showMe: {
      description: "Choisissez si vous apparaissez sur l'overlay.",
      title: "M'afficher",
    },
    showMutedUsers: {
      description:
        "Choisissez si les utilisateurs muets apparaissent sur l'overlay.",
      title: "Afficher les utilisateurs muets",
    },
    showDeafenedUsers: {
      description:
        "Choisissez si les utilisateurs sourds apparaissent sur l'overlay.",
      title: "Afficher les utilisateurs sourds",
    },
    showBots: {
      description: "Choisissez si les bots apparaissent sur l'overlay.",
      title: "Afficher les bots",
    },
    showSpeakersOnly: {
      description: "Afficher uniquement les utilisateurs qui parlent.",
      title: "Afficher seulement les orateurs",
    },
    userLimit: {
      description:
        "Définissez le nombre maximum d'utilisateurs à afficher. (0 = illimité)",
      title: "Limite d'utilisateurs",
    },
    showDisplayName: {
      description: "Choisissez quand le nom d'utilisateur apparaît.",
      title: "Affichage du nom",
    },
    showAvatarAnimated: {
      description: "Choisissez quand l'avatar apparaît en animation.",
      title: "Animation de l'avatar",
    },
    displayName: {
      description: "Choisissez quel nom afficher pour les utilisateurs.",
      username: "Nom d'utilisateur",
      title: "Nom affiché",
      nick: "Surnom du serveur",
      globalName: "Nom d'affichage",
    },
  },
  kick: {
    addStreamer: {
      alreadyAdded: "Ce nom d'utilisateur est déjà dans la liste.",
      invalid: "Veuillez entrer un nom d'utilisateur valide.",
      success: "Streamers enregistrés avec succès.",
      placeholder: "Nom d'utilisateur du streamer",
      empty: "Veuillez entrer un nom d'utilisateur.",
      save: "Enregistrer",
    },
    empty: {
      description: "Vous n'avez pas encore ajouté de streamers.",
      title: "Aucun streamer",
    },
    show: {
      whileLive: "En direct",
      always: "Toujours",
      never: "Jamais",
    },
    showOnlyLive: {
      description: "Afficher uniquement les streamers qui sont en direct.",
      title: "Afficher seulement en direct",
    },
    showDisplayName: {
      description: "Choisissez quand le nom du streamer apparaît.",
      title: "Affichage du nom",
    },
    displayName: {
      description: "Choisissez quel nom afficher pour les streamers.",
      title: "Nom affiché",
      slug: "Slug du canal",
      name: "Nom du streamer",
    },
    showCategory: {
      description: "Choisissez quand la catégorie du stream apparaît.",
      title: "Afficher la catégorie du stream",
    },
    streamerLimit: {
      description: "Choisissez le nombre maximum de streamers à afficher.",
      title: "Limite de streamers",
    },
  },
  system: {
    showCpu: {
      description: "Afficher l'utilisation du CPU.",
      title: "Afficher l'utilisation du CPU",
    },
    showMemory: {
      description: "Afficher l'utilisation de la mémoire.",
      title: "Afficher l'utilisation de la mémoire",
    },
    showNetwork: {
      description: "Afficher l'utilisation du réseau.",
      title: "Afficher l'utilisation du réseau",
    },
    showBattery: {
      description: "Afficher l'état de la batterie.",
      title: "Afficher l'état de la batterie",
    },
  },
  stream: {
    watchOnKick: "Regarder sur Kick",
  },
};
