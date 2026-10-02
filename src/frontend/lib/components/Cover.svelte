<script>
  import { coverGradient } from '$lib/format.js'

  let { seed = '', title = '', class: className = '' } = $props()
</script>

<div
  class={['@container relative overflow-hidden', className]}
  style:background={coverGradient(seed)}
  aria-hidden="true"
>
  <span
    class="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] text-[min(70cqw,18rem)] leading-none font-bold tracking-tighter text-white/25 select-none"
  >
    {title.trim().charAt(0).toUpperCase()}
  </span>
</div>
