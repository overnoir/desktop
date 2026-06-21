import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    errors: errorsSchema.parse(state.errors),
  };
}

export const useErrorsStore = defineStore(
  "errors",
  () => {
    const errors = ref<AppError[]>([]);

    function addError(
      message: AppError["message"],
      source?: AppError["source"],
    ) {
      errors.value.unshift({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        message,
        source,
      });
    }

    function removeError(errorId: AppError["id"]) {
      errors.value = errors.value.filter(({ id }) => id !== errorId);
    }

    function clearErrors() {
      errors.value = [];
    }

    return {
      clearErrors,
      removeError,
      addError,
      errors,
    };
  },
  {
    tauri: {
      hooks: {
        beforeFrontendSync: sync,
        beforeBackendSync: sync,
      },
    },
  },
);
