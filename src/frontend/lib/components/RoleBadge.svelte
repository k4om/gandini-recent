<script>
  import { roleLabel } from '$lib/format.js'

  let { role } = $props()
</script>

{#if role}
  <span
    class="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
  >
    {roleLabel(role)}
  </span>
{/if}
