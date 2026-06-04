<script setup lang="ts">
const metadata = ref<VaultItemMetadata[]>([]);
const { $toast } = useNuxtApp();
const { t } = useI18n();

try {
  metadata.value = await tauriCoreInvoke("get_vault_metadata");
} catch {
  $toast(t("vault.get.error"));
}

async function clear() {
  try {
    await tauriCoreInvoke("clear_vault");
    metadata.value = [];
  } catch {
    $toast(t("vault.clear.error"));
  }
}
</script>

<template>
  <section
    class="grid gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-between"
  >
    <Card class="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ $t("vault.heads.0") }}</TableHead>
            <TableHead>{{ $t("vault.heads.1") }}</TableHead>
            <TableHead>{{ $t("vault.heads.2") }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="metadata.length">
            <TableRow
              v-for="({ createdAt, updatedAt, key }, i) in metadata"
              :key="i"
            >
              <TableCell>{{ key }}</TableCell>
              <TableCell>{{ new Date(createdAt).toLocaleString() }}</TableCell>
              <TableCell>
                <template v-if="updatedAt">
                  {{ new Date(updatedAt).toLocaleString() }}
                </template>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="3">
            {{ $t("vault.empty") }}
          </TableEmpty>
        </TableBody>
      </Table>
    </Card>
    <template v-if="metadata.length">
      <Separator />
      <div>
        <div>
          <h1 class="text-sm">{{ $t("vault.clear.title") }}</h1>
          <p class="text-muted-foreground text-xs">
            {{ $t("vault.clear.description") }}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive" class="justify-self-end shrink-0">
              {{ $t("vault.clear.title") }}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {{ $t("vault.clear.dialog.title") }}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {{ $t("vault.clear.dialog.description") }}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {{ $t("vault.clear.dialog.cancel") }}
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" @click="clear">
                {{ $t("vault.clear.dialog.confirm") }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </template>
  </section>
</template>
