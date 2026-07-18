<script setup lang="ts">
const { get, logError, clear } = useLogs();
const logs = shallowRef<string[]>([]);

try {
  logs.value = (await get()).reverse();
} catch (error) {
  await logError({ error, source: LogSource.Logs });
}

async function clearLogs() {
  try {
    await clear();
    logs.value = [];
  } catch (error) {
    await logError({ error, source: LogSource.Logs });
  }
}
</script>

<template>
  <section class="space-y-4">
    <template v-if="logs.length">
      <SettingField
        :description="$t('logs.description')"
        :title="$t('logs.title')"
      >
        <Button variant="secondary" @click="clearLogs">{{
          $t("logs.clear")
        }}</Button>
      </SettingField>
      <Card class="p-0">
        <Table>
          <TableBody class="text-secondary-foreground">
            <TableRow v-for="(log, i) in logs" :key="i">
              <TableCell>{{ log }}</TableCell>
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
      <EmptyTitle>{{ $t("logs.empty.title") }}</EmptyTitle>
      <EmptyDescription>
        {{ $t("logs.empty.description") }}
      </EmptyDescription>
    </Empty>
  </section>
</template>
