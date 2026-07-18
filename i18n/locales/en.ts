export default {
  linkGroups: [
    [
      {
        links: ["General", "Advanced"],
        name: "Settings",
      },
      "Vault",
      "Logs",
      "Help",
    ],
    [
      ["Connection", "Settings"],
      ["Streamers", "Settings"],
      {
        links: ["Connection", "Settings"],
        name: "System",
      },
    ],
    ["Documentation"],
    ["Terms of Service", "Privacy Policy"],
  ],
  tray: {
    settings: "Settings",
    quit: "Quit",
  },
  updater: {
    checking: "Checking for updates...",
    downloading: "Downloading update...",
    loading: "Please wait...",
  },
  error: {
    clear: "Clear",
  },
  reset: {
    description: "Reset all settings to their default values.",
    success: "All settings have been successfully reset.",
    title: "Reset",
    dialog: {
      description:
        "Are you sure you want to reset all settings? This action cannot be undone.",
      title: "Reset all settings",
      confirm: "Yes, reset",
      cancel: "Cancel",
    },
  },
  settings: {
    locale: {
      description: "Select the application language.",
      title: "Language",
    },
    size: {
      description: "Adjust the overlay size.",
      title: "Size",
    },
    orientation: {
      description: "Choose the overlay orientation.",
      title: "Orientation",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    alignment: {
      description: "Choose how the overlay is aligned.",
      title: "Alignment",
      right: "Right/Bottom",
      left: "Left/Top",
      center: "Center",
    },
    position: {
      description: "Adjust the overlay position.",
      quickSelect: "Quick Select",
      title: "Position",
    },
    gap: {
      title: "Gap",
      description: "Adjust the spacing between elements.",
    },
    showBackground: {
      description: "Add a background to the overlay.",
      title: "Background",
    },
    opacity: {
      description: "Adjust the overlay transparency level.",
      title: "Opacity",
    },
    radius: {
      description: "Adjust the corner rounding of the overlay.",
      title: "Corner Radius",
    },
    showDrag: {
      description: "Make the overlay draggable.",
      title: "Drag Handle",
    },
    showSettings: {
      description: "Make settings accessible from the overlay.",
      title: "Settings",
    },
    autoStart: {
      description: "Launch the application automatically at system startup.",
      title: "Auto Start",
    },
    ignoreCursorEvents: {
      description:
        "Allow mouse clicks to pass through the overlay to windows behind it.",
      title: "Ignore Cursor",
    },
    contentProtected: {
      description:
        "Prevent the application from appearing in screen recordings or sharing.",
      title: "Capture Protection",
    },
    alwaysOnTop: {
      description: "Keep the application always on top of other windows.",
      title: "Always on Top",
    },
  },
  vault: {
    heads: ["Key", "Created Date", "Updated Date"],
    empty: {
      description: "There is no data in your vault.",
      title: "Vault is Empty",
    },
    clear: {
      success: "All vault data has been successfully deleted.",
      description: "Delete all data in the vault.",
      title: "Delete Data",
      dialog: {
        description:
          "Are you sure you want to delete all vault data? This action cannot be undone.",
        title: "Delete all vault data",
        confirm: "Yes, delete",
        cancel: "Cancel",
      },
    },
  },
  logs: {
    description: "Delete all logs.",
    title: "Delete Logs",
    clear: "Clear",
    empty: {
      description: "No logs available.",
      title: "No Logs",
    },
  },
  discord: {
    connect: {
      success: "Connected successfully.",
      button: "Connect",
    },
    disconnect: {
      description: "Connected as {username}.",
      success: "Disconnected successfully.",
      button: "Disconnect",
      dialog: {
        description: "Are you sure you want to disconnect?",
        deleteVaultItems: "Remove token data from vault",
        confirm: "Yes, disconnect",
        cancel: "Cancel",
        title: "Confirm",
      },
    },
    show: {
      whileSpeaking: "While Speaking",
      always: "Always",
      never: "Never",
    },
    showGuild: {
      description:
        "Choose whether the server name, icon and channel name appear on the overlay.",
      title: "Show Server Info",
    },
    showGuildIconAnimated: {
      description: "Choose whether the server icon appears animated.",
      title: "Server Icon Animation",
    },
    showMe: {
      description: "Choose whether you appear on the overlay.",
      title: "Show Me",
    },
    showMutedUsers: {
      description: "Choose whether muted users appear on the overlay.",
      title: "Show Muted Users",
    },
    showDeafenedUsers: {
      description: "Choose whether deafened users appear on the overlay.",
      title: "Show Deafened Users",
    },
    showBots: {
      description: "Choose whether bots appear on the overlay.",
      title: "Show Bots",
    },
    showSpeakersOnly: {
      description: "Only show users who are speaking.",
      title: "Show Speakers Only",
    },
    userLimit: {
      description:
        "Set the maximum number of users to display. (0 = unlimited)",
      title: "User Limit",
    },
    showDisplayName: {
      description: "Choose when the username appears.",
      title: "Name Display",
    },
    showAvatarAnimated: {
      description: "Choose when the avatar appears animated.",
      title: "Avatar Animation",
    },
    displayName: {
      description: "Choose which name to display for users.",
      username: "Username",
      title: "Display Name",
      nick: "Server Nickname",
      globalName: "Display Name",
    },
  },
  kick: {
    addChannel: {
      alreadyAdded: "This username is already in the list.",
      invalid: "Please enter a valid username.",
      success: "Streamers saved successfully.",
      placeholder: "Streamer username",
      empty: "Please enter a username.",
      save: "Save",
    },
    empty: {
      description: "You haven't added any streamers yet.",
      title: "No Streamers",
    },
    show: {
      whileLive: "While Live",
      always: "Always",
      never: "Never",
    },
    showOnlyLive: {
      description: "Only show streamers that are currently live.",
      title: "Show Live Only",
    },
    showDisplayName: {
      description: "Choose when the streamer name appears.",
      title: "Name Display",
    },
    displayName: {
      description: "Choose which name to display for streamers.",
      title: "Display Name",
      slug: "Channel Slug",
      name: "Streamer Name",
    },
    showCategory: {
      description: "Choose when the stream category appears.",
      title: "Show Stream Category",
    },
    streamerLimit: {
      description: "Choose the maximum number of streamers to display.",
      title: "Streamer Limit",
    },
  },
  system: {
    showCpu: {
      description: "Show CPU usage.",
      title: "Show CPU Usage",
    },
    showMemory: {
      description: "Show memory usage.",
      title: "Show Memory Usage",
    },
    showNetwork: {
      description: "Show network usage.",
      title: "Show Network Usage",
    },
    showBattery: {
      description: "Show battery status.",
      title: "Show Battery Status",
    },
  },
  stream: {
    watchOnKick: "Watch on Kick",
  },
};
