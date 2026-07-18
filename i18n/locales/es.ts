export default {
  linkGroups: [
    [
      {
        links: ["General", "Avanzado"],
        name: "Ajustes",
      },
      "Caja fuerte",
      "Registros",
      "Ayuda",
    ],
    [
      ["Conexión", "Ajustes"],
      ["Streamers", "Ajustes"],
      {
        links: ["Conexión", "Ajustes"],
        name: "Sistema",
      },
    ],
    ["Documentación"],
    ["Términos de Uso", "Política de Privacidad"],
  ],
  tray: {
    settings: "Ajustes",
    quit: "Salir",
  },
  updater: {
    checking: "Buscando actualizaciones...",
    downloading: "Descargando actualización...",
    loading: "Espere, por favor...",
  },
  error: {
    clear: "Limpiar",
  },
  reset: {
    description: "Restablecer todos los ajustes a sus valores predeterminados.",
    success: "Todos los ajustes se han restablecido correctamente.",
    title: "Restablecer",
    dialog: {
      description:
        "¿Está seguro de que desea restablecer todos los ajustes? Esta acción no se puede deshacer.",
      title: "Restablecer todos los ajustes",
      confirm: "Sí, restablecer",
      cancel: "Cancelar",
    },
  },
  settings: {
    locale: {
      description: "Seleccione el idioma de la aplicación.",
      title: "Idioma",
    },
    size: {
      description: "Ajuste el tamaño de la superposición.",
      title: "Tamaño",
    },
    orientation: {
      description: "Elija la orientación de la superposición.",
      title: "Orientación",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    alignment: {
      description: "Elija la alineación de la superposición.",
      title: "Alineación",
      right: "Derecha/Abajo",
      left: "Izquierda/Arriba",
      center: "Centro",
    },
    position: {
      description: "Ajuste la posición de la superposición.",
      quickSelect: "Selección Rápida",
      title: "Posición",
    },
    gap: {
      title: "Espaciado",
      description: "Ajuste el espaciado entre los elementos.",
    },
    showBackground: {
      description: "Añada un fondo a la superposición.",
      title: "Fondo",
    },
    opacity: {
      description: "Ajuste el nivel de transparencia de la superposición.",
      title: "Opacidad",
    },
    radius: {
      description: "Ajuste el redondeo de las esquinas de la superposición.",
      title: "Radio de Esquinas",
    },
    showDrag: {
      description: "Haga que la superposición sea arrastrable.",
      title: "Tirador de Arrastre",
    },
    showSettings: {
      description:
        "Haga que los ajustes sean accesibles desde la superposición.",
      title: "Ajustes",
    },
    autoStart: {
      description:
        "Inicie la aplicación automáticamente al arrancar el sistema.",
      title: "Inicio Automático",
    },
    ignoreCursorEvents: {
      description:
        "Permita que los clics del ratón atraviesen la superposición hacia las ventanas posteriores.",
      title: "Ignorar Cursor",
    },
    contentProtected: {
      description:
        "Evite que la aplicación aparezca en grabaciones o comparticiones de pantalla.",
      title: "Protección de Captura",
    },
    alwaysOnTop: {
      description: "Mantenga la aplicación siempre en primer plano.",
      title: "Siempre en Primer Plano",
    },
  },
  vault: {
    heads: ["Clave", "Fecha de Creación", "Fecha de Actualización"],
    empty: {
      description: "No hay datos en su caja fuerte.",
      title: "Caja Fuerte Vacía",
    },
    clear: {
      success:
        "Todos los datos de la caja fuerte se han eliminado correctamente.",
      description: "Elimine todos los datos de la caja fuerte.",
      title: "Eliminar Datos",
      dialog: {
        description:
          "¿Está seguro de que desea eliminar todos los datos de la caja fuerte? Esta acción no se puede deshacer.",
        title: "Eliminar todos los datos de la caja fuerte",
        confirm: "Sí, eliminar",
        cancel: "Cancelar",
      },
    },
  },
  logs: {
    description: "Registros de la aplicación.",
    title: "Registros",
    clear: "Limpiar",
    empty: {
      description: "No hay registros disponibles.",
      title: "Sin Registros",
    },
  },
  discord: {
    connect: {
      success: "Conectado correctamente.",
      button: "Conectar",
    },
    disconnect: {
      description: "Conectado como {username}.",
      success: "Desconectado correctamente.",
      button: "Desconectar",
      dialog: {
        description: "¿Está seguro de que desea desconectarse?",
        deleteVaultItems: "Eliminar los datos del token de la caja fuerte",
        confirm: "Sí, desconectar",
        cancel: "Cancelar",
        title: "Confirmar",
      },
    },
    show: {
      whileSpeaking: "Al Hablar",
      always: "Siempre",
      never: "Nunca",
    },
    showGuild: {
      description:
        "Elija si el nombre del servidor, el icono y el nombre del canal aparecen en la superposición.",
      title: "Mostrar Información del Servidor",
    },
    showGuildIconAnimated: {
      description: "Elija si el icono del servidor aparece animado.",
      title: "Animación del Icono del Servidor",
    },
    showMe: {
      description: "Elija si aparece usted en la superposición.",
      title: "Mostrarme",
    },
    showMutedUsers: {
      description:
        "Elija si los usuarios silenciados aparecen en la superposición.",
      title: "Mostrar Usuarios Silenciados",
    },
    showDeafenedUsers: {
      description:
        "Elija si los usuarios ensordecidos aparecen en la superposición.",
      title: "Mostrar Usuarios Ensordecidos",
    },
    showBots: {
      description: "Elija si los bots aparecen en la superposición.",
      title: "Mostrar Bots",
    },
    showSpeakersOnly: {
      description: "Mostrar solo los usuarios que están hablando.",
      title: "Mostrar Solo Hablantes",
    },
    userLimit: {
      description:
        "Establezca el número máximo de usuarios a mostrar. (0 = ilimitado)",
      title: "Límite de Usuarios",
    },
    showDisplayName: {
      description: "Elija cuándo aparece el nombre de usuario.",
      title: "Visualización del Nombre",
    },
    showAvatarAnimated: {
      description: "Elija cuándo aparece el avatar animado.",
      title: "Animación del Avatar",
    },
    displayName: {
      description: "Elija qué nombre mostrar para los usuarios.",
      username: "Nombre de Usuario",
      title: "Nombre a Mostrar",
      nick: "Apodo del Servidor",
      globalName: "Nombre de Visualización",
    },
  },
  kick: {
    addChannel: {
      alreadyAdded: "Este nombre de usuario ya está en la lista.",
      invalid: "Por favor, introduzca un nombre de usuario válido.",
      success: "Streamers guardados correctamente.",
      placeholder: "Nombre de usuario del streamer",
      empty: "Por favor, introduzca un nombre de usuario.",
      save: "Guardar",
    },
    empty: {
      description: "Aún no ha añadido ningún streamer.",
      title: "Sin Streamers",
    },
    show: {
      whileLive: "En Directo",
      always: "Siempre",
      never: "Nunca",
    },
    showOnlyLive: {
      description: "Mostrar solo los streamers que están en directo.",
      title: "Mostrar Solo en Directo",
    },
    showDisplayName: {
      description: "Elija cuándo aparece el nombre del streamer.",
      title: "Visualización del Nombre",
    },
    displayName: {
      description: "Elija qué nombre mostrar para los streamers.",
      title: "Nombre a Mostrar",
      slug: "Slug del Canal",
      name: "Nombre del Streamer",
    },
    showCategory: {
      description: "Elija cuándo aparece la categoría del stream.",
      title: "Mostrar Categoría del Stream",
    },
    streamerLimit: {
      description: "Elija el número máximo de streamers a mostrar.",
      title: "Límite de Streamers",
    },
  },
  system: {
    showCpu: {
      description: "Mostrar uso del CPU.",
      title: "Mostrar Uso del CPU",
    },
    showMemory: {
      description: "Mostrar uso de la memoria.",
      title: "Mostrar Uso de la Memoria",
    },
    showNetwork: {
      description: "Mostrar uso de la red.",
      title: "Mostrar Uso de la Red",
    },
    showBattery: {
      description: "Mostrar estado de la batería.",
      title: "Mostrar Estado de la Batería",
    },
  },
  stream: {
    watchOnKick: "Ver en Kick",
  },
};
