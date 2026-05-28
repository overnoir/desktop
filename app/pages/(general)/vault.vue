<script setup lang="ts">
const mockVault = [
  { key: "mock_key_1", createdAt: Date.now(), updatedAt: Date.now() },
  { key: "mock_key_2", createdAt: Date.now() },
];
</script>

<template>
  <section>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t("vault.heads.0") }}</TableHead>
          <TableHead>{{ $t("vault.heads.1") }}</TableHead>
          <TableHead>{{ $t("vault.heads.2") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="mockVault.length">
          <TableRow
            v-for="({ createdAt, updatedAt, key }, i) in mockVault"
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
  </section>
</template>
