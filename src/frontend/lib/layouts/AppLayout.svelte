<script>
  import { onMount } from 'svelte'
  import { router } from 'svelte-spa-router'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import { theme } from '$lib/theme.svelte.js'

  let { children } = $props()

  onMount(() => theme.init())

  // Hash routing doesn't reset scroll on its own
  $effect(() => {
    router.location
    window.scrollTo({ top: 0 })
  })
</script>

<div class="flex min-h-dvh flex-col bg-background">
  <Header />
  <main class="flex-1">
    {@render children?.()}
  </main>
  <Footer />
</div>