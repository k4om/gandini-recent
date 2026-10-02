<script>
  import { router, push } from 'svelte-spa-router'
  import { Menu, X, Sun, Moon, LogOut } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Avatar from '$lib/components/Avatar.svelte'
  import { auth } from '$lib/auth.svelte.js'
  import { theme } from '$lib/theme.svelte.js'

  let open = $state(false)

  const links = $derived([
    { name: 'Beranda', href: '/' },
    { name: 'Semua berita', href: '/articles' },
    ...(auth.canWrite ? [{ name: 'Tulis', href: '/write' }] : []),
    ...(auth.isAdmin ? [{ name: 'Admin', href: '/admin' }] : [])
  ])

  const isActive = (href) =>
    href === '/' ? router.location === '/' : router.location.startsWith(href)

  // Close the mobile menu whenever the route changes
  $effect(() => {
    router.location
    open = false
  })

  function logout() {
    auth.logout()
    push('/')
  }
</script>

<header class="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
  <div class="container-page flex h-16 items-center justify-between gap-4">
    <a href="#/" class="block shrink-0" aria-label="Gandini Recent, ke beranda">
      <picture>
        <source media="(min-width: 768px)" srcset="/icon-with-banner.png" />
        <img
          src="/icon-with-banner.png"
          alt="Gandini Recent"
          class="block h-9 w-auto object-contain md:h-10"
        />
      </picture>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Utama">
      {#each links as item (item.href)}
        <a
          href={`#${item.href}`}
          aria-current={isActive(item.href) ? 'page' : undefined}
          class={[
            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]}
        >
          {item.name}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onclick={theme.toggle}
        aria-label={theme.dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      >
        {#if theme.dark}
          <Sun />
        {:else}
          <Moon />
        {/if}
      </Button>

      <div class="hidden items-center gap-2 md:flex">
        {#if auth.isLoggedIn}
          <a
            href={`#/user/${auth.user.id}`}
            class="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm font-medium hover:bg-muted"
          >
            <Avatar name={auth.user.name} />
            {auth.user.name}
          </a>
          <Button variant="ghost" size="icon" onclick={logout} aria-label="Keluar">
            <LogOut />
          </Button>
        {:else}
          <Button href="#/login">Masuk</Button>
        {/if}
      </div>

      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        onclick={() => (open = !open)}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
      >
        {#if open}
          <X />
        {:else}
          <Menu />
        {/if}
      </Button>
    </div>
  </div>

  <div
    class="grid transition-[grid-template-rows] duration-200 md:hidden"
    class:grid-rows-[1fr]={open}
    class:grid-rows-[0fr]={!open}
  >
    <div class="overflow-hidden">
      <nav class="container-page flex flex-col gap-1 border-t py-3" aria-label="Menu seluler">
        {#each links as item (item.href)}
          <a
            href={`#${item.href}`}
            class={[
              'rounded-xl px-3 py-2.5 text-sm font-medium',
              isActive(item.href) ? 'bg-muted' : 'text-muted-foreground'
            ]}
          >
            {item.name}
          </a>
        {/each}

        <div class="mt-2 border-t pt-3">
          {#if auth.isLoggedIn}
            <a
              href={`#/user/${auth.user.id}`}
              class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
            >
              <Avatar name={auth.user.name} />
              {auth.user.name}
            </a>
            <button
              type="button"
              onclick={logout}
              class="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground"
            >
              <LogOut class="size-4" /> Keluar
            </button>
          {:else}
            <Button href="#/login" class="w-full">Masuk</Button>
          {/if}
        </div>
      </nav>
    </div>
  </div>
</header>