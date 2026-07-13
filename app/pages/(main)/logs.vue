<script setup lang="ts">
const { getLogs, logError } = useLogs();
const logs = ref<string[]>([]);

try {
  logs.value = await getLogs();
} catch (error) {
  await logError({ error, source: LogSource.Logs });
}
</script>

<template>
  <section class="space-y-4">
    <template v-if="logs.length">
      <SettingField
        :title="`${$t('logs.title')} (${logs.length})`"
        :description="$t('logs.description')"
      />
      <Separator />
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
