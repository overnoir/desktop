<script setup lang="ts">
const metadata = shallowRef<VaultItemMetadata[]>([]);
const { clear, getMetadata } = useVault();
const { $toast } = useNuxtApp();
const { logError } = useLogs();
const { t } = useI18n();

try {
  metadata.value = await getMetadata();
} catch (error) {
  await logError({ error, source: LogSource.Vault });
}

async function clearVault() {
  try {
    await clear();
    metadata.value = [];
    $toast.success(t("vault.clear.success"));
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ error, source: LogSource.Vault });
  }
}
</script>

<template>
  <section class="space-y-4">
    <template v-if="metadata.length">
      <SettingField
        :description="$t('vault.clear.description')"
        :title="$t('vault.clear.title')"
      >
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive">
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
              <AlertDialogAction variant="destructive" @click="clearVault">
                {{ $t("vault.clear.dialog.confirm") }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingField>
      <Card class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ $t("vault.heads.0") }}</TableHead>
              <TableHead>{{ $t("vault.heads.1") }}</TableHead>
              <TableHead>{{ $t("vault.heads.2") }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="text-secondary-foreground">
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
          </TableBody>
        </Table>
      </Card>
    </template>
    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="lucide:ghost" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>{{ $t("vault.empty.title") }}</EmptyTitle>
      <EmptyDescription>{{ $t("vault.empty.description") }}</EmptyDescription>
    </Empty>
  </section>
</template>
