<script>
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { LoaderCircle } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Notice from '$lib/components/Notice.svelte'
  import { auth } from '$lib/auth.svelte.js'

  let {
    title,
    subtitle = '',
    idLabel,
    idPlaceholder = '',
    numeric = false,
    action,
    redirectTo = '/',
    hint = '',
    footer
  } = $props()

  let identifier = $state('')
  let password = $state('')
  let loading = $state(false)
  let error = $state(null)

  // Already signed in? Skip the form.
  onMount(() => {
    if (auth.isLoggedIn) push(redirectTo)
  })

  async function submit(event) {
    event.preventDefault()
    error = null

    const raw = identifier.trim()
    if (numeric && !/^\d+$/.test(raw)) {
      error = `${idLabel} harus berupa angka.`
      return
    }

    loading = true
    try {
      const { token, user } = await action(numeric ? Number(raw) : raw, password)
      auth.login(token, user)
      push(redirectTo)
    } catch (e) {
      error = e.message
    } finally {
      loading = false
    }
  }
</script>

<div class="container-page flex justify-center py-14 sm:py-20">
  <div class="w-full max-w-md">
    <h1 class="text-3xl font-semibold tracking-tight">{title}</h1>
    {#if subtitle}
      <p class="mt-2 text-muted-foreground">{subtitle}</p>
    {/if}

    <form
      onsubmit={submit}
      class="mt-8 flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
    >
      {#if error}
        <Notice>{error}</Notice>
      {/if}

      <div class="flex flex-col gap-2">
        <label for="identifier" class="text-sm font-medium">{idLabel}</label>
        <input
          id="identifier"
          type="text"
          inputmode={numeric ? 'numeric' : 'text'}
          autocomplete="username"
          autocapitalize="none"
          bind:value={identifier}
          required
          class="field"
          placeholder={idPlaceholder}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="text-sm font-medium">Kata sandi</label>
        <input
          id="password"
          type="password"
          autocomplete="current-password"
          bind:value={password}
          required
          class="field"
        />
      </div>

      <Button type="submit" size="lg" disabled={loading} class="w-full">
        {#if loading}
          <LoaderCircle class="animate-spin" /> Memproses…
        {:else}
          Masuk
        {/if}
      </Button>
    </form>

    {@render footer?.()}

    {#if hint && import.meta.env.DEV}
      <p class="mt-6 rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        Mode pengembangan. {hint}
      </p>
    {/if}
  </div>
</div>