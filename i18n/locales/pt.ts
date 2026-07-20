export default {
  linkGroups: [
    [
      {
        links: ["Geral", "Avançado"],
        name: "Configurações",
      },
      "Cofre",
      "Registos",
      "Sobre",
    ],
    [
      ["Ligação", "Configurações"],
      ["Ligação", "Configurações"],
      {
        links: ["Ligação", "Configurações"],
        name: "Sistema",
      },
    ],
    ["Documentação"],
    ["Termos de Uso", "Política de Privacidade"],
  ],
  tray: {
    settings: "Configurações",
    quit: "Sair",
  },
  updater: {
    checking: "A verificar atualizações...",
    downloading: "A transferir atualização...",
    loading: "Aguarde, por favor...",
  },
  error: {
    clear: "Limpar",
  },
  reset: {
    description: "Repor todas as configurações para os valores predefinidos.",
    success: "Todas as configurações foram repostas com sucesso.",
    title: "Repor",
    dialog: {
      description:
        "Tem a certeza de que deseja repor todas as configurações? Esta ação não pode ser desfeita.",
      title: "Repor todas as configurações",
      confirm: "Sim, repor",
      cancel: "Cancelar",
    },
  },
  settings: {
    locale: {
      description: "Selecione o idioma da aplicação.",
      title: "Idioma",
    },
    size: {
      description: "Ajuste o tamanho da sobreposição.",
      title: "Tamanho",
    },
    orientation: {
      description: "Escolha a orientação da sobreposição.",
      title: "Orientação",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    alignment: {
      description: "Escolha o alinhamento da sobreposição.",
      title: "Alinhamento",
      right: "Direita/Embaixo",
      left: "Esquerda/Em cima",
      center: "Centro",
    },
    position: {
      description: "Ajuste a posição da sobreposição.",
      quickSelect: "Seleção Rápida",
      title: "Posição",
    },
    gap: {
      title: "Espaçamento",
      description: "Ajuste o espaçamento entre os elementos.",
    },
    showBackground: {
      description: "Adicione um fundo à sobreposição.",
      title: "Fundo",
    },
    opacity: {
      description: "Ajuste o nível de transparência da sobreposição.",
      title: "Opacidade",
    },
    radius: {
      description: "Ajuste o arredondamento dos cantos da sobreposição.",
      title: "Raio dos Cantos",
    },
    showDrag: {
      description: "Torne a sobreposição arrastável.",
      title: "Alça de Arrasto",
    },
    showSettings: {
      description:
        "Torne as configurações acessíveis a partir da sobreposição.",
      title: "Configurações",
    },
    autoStart: {
      description: "Inicie a aplicação automaticamente ao iniciar o sistema.",
      title: "Início Automático",
    },
    ignoreCursorEvents: {
      description:
        "Permita que os cliques do rato atravessem a sobreposição para as janelas por trás.",
      title: "Ignorar Cursor",
    },
    contentProtected: {
      description:
        "Impeça que a aplicação apareça em gravações ou partilhas de ecrã.",
      title: "Proteção de Captura",
    },
    alwaysOnTop: {
      description: "Mantenha a aplicação sempre no primeiro plano.",
      title: "Sempre no Primeiro Plano",
    },
  },
  vault: {
    heads: ["Chave", "Data de Criação", "Data de Atualização"],
    empty: {
      description: "Não existem dados no seu cofre.",
      title: "Cofre Vazio",
    },
    clear: {
      success: "Todos os dados do cofre foram eliminados com sucesso.",
      description: "Elimine todos os dados do cofre.",
      title: "Eliminar Dados",
      dialog: {
        description:
          "Tem a certeza de que deseja eliminar todos os dados do cofre? Esta ação não pode ser desfeita.",
        title: "Eliminar todos os dados do cofre",
        confirm: "Sim, eliminar",
        cancel: "Cancelar",
      },
    },
  },
  logs: {
    description: "Eliminar todos os registos.",
    title: "Eliminar Registos",
    clear: "Limpar",
    empty: {
      description: "Nenhum registo disponível.",
      title: "Sem Registos",
    },
  },
  discord: {
    connect: {
      description:
        "Ligue-se para ver a atividade do canal de voz na sobreposição.",
      clientId: {
        description: "Como posso obter um Client ID?",
        placeholder: "ID de Cliente da Aplicação",
      },
      success: "Ligado com sucesso.",
      button: "Ligar",
    },
    disconnect: {
      description: "Ligado como {username}.",
      success: "Desligado com sucesso.",
      button: "Desligar",
      dialog: {
        description: "Tem a certeza de que deseja desligar?",
        deleteVaultItems: "Remover dados do token do cofre",
        confirm: "Sim, desligar",
        cancel: "Cancelar",
        title: "Confirmar",
      },
    },
    show: {
      whileSpeaking: "Ao Falar",
      always: "Sempre",
      never: "Nunca",
    },
    showGuild: {
      description:
        "Escolha se o nome do servidor, ícone e nome do canal aparecem na sobreposição.",
      title: "Mostrar Informações do Servidor",
    },
    showGuildIconAnimated: {
      description: "Escolha se o ícone do servidor aparece animado.",
      title: "Animação do Ícone do Servidor",
    },
    showMe: {
      description: "Escolha se aparece na sobreposição.",
      title: "Mostrar-me",
    },
    showMutedUsers: {
      description:
        "Escolha se os utilizadores silenciados aparecem na sobreposição.",
      title: "Mostrar Utilizadores Silenciados",
    },
    showDeafenedUsers: {
      description:
        "Escolha se os utilizadores ensurdecidos aparecem na sobreposição.",
      title: "Mostrar Utilizadores Ensurdecidos",
    },
    showBots: {
      description: "Escolha se os bots aparecem na sobreposição.",
      title: "Mostrar Bots",
    },
    showSpeakersOnly: {
      description: "Mostrar apenas os utilizadores que estão a falar.",
      title: "Mostrar Apenas Oradores",
    },
    userLimit: {
      description:
        "Defina o número máximo de utilizadores a mostrar. (0 = ilimitado)",
      title: "Limite de Utilizadores",
    },
    showDisplayName: {
      description: "Escolha quando o nome de utilizador aparece.",
      title: "Exibição do Nome",
    },
    showAvatarAnimated: {
      description: "Escolha quando o avatar aparece animado.",
      title: "Animação do Avatar",
    },
    displayName: {
      description: "Escolha qual o nome a mostrar para os utilizadores.",
      username: "Nome de Utilizador",
      title: "Nome a Mostrar",
      nick: "Alcunha do Servidor",
      globalName: "Nome de Exibição",
    },
  },
  kick: {
    addStreamer: {
      alreadyAdded: "Este nome de utilizador já está na lista.",
      invalid: "Por favor, insira um nome de utilizador válido.",
      success: "Streamers guardados com sucesso.",
      placeholder: "Nome de utilizador do streamer",
      empty: "Por favor, insira um nome de utilizador.",
      save: "Guardar",
    },
    empty: {
      description: "Ainda não adicionou nenhum streamer.",
      title: "Sem Streamers",
    },
    show: {
      whileLive: "Em Direto",
      always: "Sempre",
      never: "Nunca",
    },
    showOnlyLive: {
      description: "Mostrar apenas os streamers que estão em direto.",
      title: "Mostrar Apenas em Direto",
    },
    showDisplayName: {
      description: "Escolha quando o nome do streamer aparece.",
      title: "Exibição do Nome",
    },
    displayName: {
      description: "Escolha qual o nome a mostrar para os streamers.",
      title: "Nome a Mostrar",
      slug: "Slug do Canal",
      name: "Nome do Streamer",
    },
    showCategory: {
      description: "Escolha quando a categoria do stream aparece.",
      title: "Mostrar Categoria do Stream",
    },
    streamerLimit: {
      description: "Escolha o número máximo de streamers a mostrar.",
      title: "Limite de Streamers",
    },
  },
  system: {
    showCpu: {
      description: "Mostrar uso do CPU.",
      title: "Mostrar Uso do CPU",
    },
    showMemory: {
      description: "Mostrar uso da memória.",
      title: "Mostrar Uso da Memória",
    },
    showNetwork: {
      description: "Mostrar uso da rede.",
      title: "Mostrar Uso da Rede",
    },
    showBattery: {
      description: "Mostrar estado da bateria.",
      title: "Mostrar Estado da Bateria",
    },
  },
  stream: {
    watchOnKick: "Ver no Kick",
  },
};
