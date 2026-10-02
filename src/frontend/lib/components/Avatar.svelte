<script>
  import { initials, hueFor } from '$lib/format.js'

  let { name = '', class: className = 'size-8 text-xs' } = $props()
  const hue = $derived(hueFor(name))
</script>

<span
  class={[
    'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
    className
  ]}
  style:background={`oklch(0.93 0.05 ${hue})`}
  style:color={`oklch(0.38 0.12 ${hue})`}
  aria-hidden="true"
>
  {initials(name)}
</span>
