<script>
  import { push } from 'svelte-spa-router'
  import { LogOut, PenLine } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Avatar from '$lib/components/Avatar.svelte'
  import RoleBadge from '$lib/components/RoleBadge.svelte'
  import ArticleCard from '$lib/components/ArticleCard.svelte'
  import CardSkeleton from '$lib/components/CardSkeleton.svelte'
  import Notice from '$lib/components/Notice.svelte'
  import { fetchUser, fetchArticles } from '$lib/api.js'
  import { auth } from '$lib/auth.svelte.js'

  let { params } = $props()

  let user = $state(null)
  let articles = $state([])
  let loading = $state(true)
  let error = $state(null)

  let requestId = 0

  const isMe = $derived(auth.user && user && String(auth.user.id) === String(user.id))

  $effect(() => {
    load(params.id)
  })

  async function load(id) {
    const current = ++requestId
    loading = true
    error = null
    user = null
    articles = []

    try {
      const [found, all] = await Promise.all([
        fetchUser(id),
        // The API has no "articles by author" query, so filter published ones client-side
        fetchArticles({ limit: 100 })
      ])
      if (current !== requestId) return
      user = found
      articles = found ? all.filter((a) => String(a.author.id) === String(found.id)) : []
    } catch (e) {
      if (current === requestId) error = e.message
    } finally {
      if (current === requestId) loading = false
    }
  }

  function logout() {
    auth.logout()
    push('/')
  }
</script>

<svelte:head>
  <title>{user ? `${user.name} | Gandini Recent` : 'Profil | Gandini Recent'}</title>
</svelte:head>

<div class="container-page py-10 sm:py-14">
  {#if loading}
    <div class="flex animate-pulse items-center gap-5" aria-hidden="true">
      <div class="size-20 rounded-full bg-muted"></div>
      <div class="space-y-3">
        <div class="h-7 w-52 rounded bg-muted"></div>
        <div class="h-4 w-32 rounded bg-muted"></div>
      </div>
    </div>
    <div class="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(3) as _}
        <CardSkeleton />
      {/each}
    </div>
  {:else if error}
    <Notice>
      <p class="font-medium">Profil belum bisa dimuat.</p>
      <p class="mt-1 opacity-90">{error}</p>
    </Notice>
  {:else if !user}
    <div class="mx-auto max-w-xl py-10 text-center">
      <h1 class="text-3xl font-semibold">Pengguna tidak ditemukan</h1>
      <p class="mt-3 text-muted-foreground">Profil yang kamu cari tidak ada atau sudah dihapus.</p>
      <Button href="#/" class="mt-8">Kembali ke beranda</Button>
    </div>
  {:else}
    <header class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-5">
        <Avatar name={user.name} class="size-20 text-2xl" />
        <div>
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{user.name}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <RoleBadge role={user.role} />
            <span>{user.canWrite ? 'Penulis' : 'Pembaca'}</span>
          </div>
        </div>
      </div>

      {#if isMe}
        <div class="flex flex-wrap gap-3">
          {#if auth.canWrite}
            <Button href="#/write"><PenLine /> Tulis artikel</Button>
          {/if}
          <Button variant="outline" onclick={logout}><LogOut /> Keluar</Button>
        </div>
      {/if}
    </header>

    <section class="mt-14" aria-labelledby="posts-heading">
      <h2 id="posts-heading" class="mb-8 border-b pb-4 text-2xl font-semibold">
        Artikel{articles.length ? ` (${articles.length})` : ''}
      </h2>

      {#if articles.length}
        <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {#each articles as article (article.id)}
            <ArticleCard {article} />
          {/each}
        </div>
      {:else}
        <p class="text-muted-foreground">
          {isMe ? 'Kamu belum punya artikel yang terbit.' : `${user.name} belum menerbitkan artikel.`}
        </p>
      {/if}
    </section>
  {/if}
</div>
