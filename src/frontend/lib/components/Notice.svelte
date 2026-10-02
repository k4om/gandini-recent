<script>
  import { CircleAlert, Check, Info } from '@lucide/svelte'

  let { variant = 'error', class: className = '', children } = $props()

  const icons = { error: CircleAlert, success: Check, info: Info }
  const styles = {
    error: 'border-destructive/30 bg-destructive/10 text-destructive',
    success:
      'border-emerald-600/30 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300',
    info: 'border-border bg-muted text-foreground'
  }

  const Icon = $derived(icons[variant])
</script>

<div
  role={variant === 'error' ? 'alert' : 'status'}
  class={['flex items-start gap-3 rounded-xl border p-4 text-sm', styles[variant], className]}
>
  <Icon class="mt-0.5 size-4 shrink-0" />
  <div class="min-w-0 flex-1">{@render children?.()}</div>
</div>
