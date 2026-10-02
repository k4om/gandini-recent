<script>
  import { router } from 'svelte-spa-router'
  import { LoaderCircle, Search } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Notice from '$lib/components/Notice.svelte'
  import Avatar from '$lib/components/Avatar.svelte'
  import RoleBadge from '$lib/components/RoleBadge.svelte'
  import { fetchArticle, publishArticle, fetchUser } from '$lib/api.js'
  import { auth } from '$lib/auth.svelte.js'
  import { formatDate, excerpt } from '$lib/format.js'

  /* ---- Article lookup / publish ---- */
  let articleQuery = $state('')
  let article = $state(null)
  let articleSearched = $state(false)
  let articleLoading = $state(false)
  let publishing = $state(false)
  let articleError = $state(null)
  let publishedNotice = $state(false)

  async function lookupArticle(value = articleQuery) {
    const q = value.trim()
    if (!q) return

    articleLoading = true
    articleError = null
    publishedNotice = false
    try {
      // Numeric input is treated as an ID, anything else as a slug
      article = await fetchArticle(/^\d+$/.test(q) ? { id: q } : { slug: q })
      articleSearched = true
    } catch (e) {
      articleError = e.message
    } finally {
      articleLoading = false
    }
  }

  async function publish() {
    publishing = true
    articleError = null
    try {
      article = await publishArticle(article.id)
      publishedNotice = true
    } catch (e) {
      articleError = e.message
    } finally {
      publishing = false
    }
  }

  // Support /#/admin?q=some-slug (the Write page can link here)
  $effect(() => {
    const q = new URLSearchParams(router.querystring).get('q')
    if (q && auth.isAdmin) {
      articleQuery = q
      lookupArticle(q)
    }
  })

  /* ---- User lookup ---- */
  let userQuery = $state('')
  let user = $state(null)
  let userSearched = $state(false)
  let userLoading = $state(false)
  let userError = $state(null)

  async function lookupUser(event) {
    event.preventDefault()
    const q = userQuery.trim()
    if (!/^\d+$/.test(q)) {
      userError = 'Masukkan ID pengguna berupa angka.'
      return
    }

    userLoading = true
    userError = null
    try {
      user = await fetchUser(q)
      userSearched = true
    } catch (e) {
      userError = e.message
    } finally {
      userLoading = false
    }
  }
</script>

<svelte:head>
  <title>Admin | Gandini Recent</title>
</svelte:head>

<div class="container-page py-10 sm:py-14">
  {#if !auth.isLoggedIn}
    <div class="mx-auto max-w-xl text-center">
      <h1 class="text-3xl font-semibold">Masuk sebagai admin</h1>
      <p class="mt-3 text-muted-foreground">Halaman ini hanya untuk admin sekolah.</p>
      <Button href="#/admin/login" class="mt-8">Masuk</Button>
    </div>
  {:else if !auth.isAdmin}
    <div class="mx-auto max-w-xl text-center">
      <h1 class="text-3xl font-semibold">Khusus admin</h1>
      <p class="mt-3 text-muted-foreground">Akunmu tidak punya akses ke halaman ini.</p>
      <Button href="#/" variant="outline" class="mt-8">Kembali ke beranda</Button>
    </div>
  {:else}
    <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Admin</h1>
    <p class="mt-2 text-muted-foreground">Terbitkan draf artikel dan cek akun pengguna.</p>

    <div class="mt-10 grid gap-8 lg:grid-cols-2">
      <!-- Publish -->
      <section class="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="publish-heading">
        <h2 id="publish-heading" class="text-xl font-semibold">Terbitkan artikel</h2>
        <p class="mt-1 text-sm text-muted-foreground">Cari dengan ID atau slug, lalu periksa sebelum menerbitkan.</p>

        <form
          class="mt-6 flex gap-2"
          onsubmit={(e) => {
            e.preventDefault()
            lookupArticle()
          }}
        >
          <label class="sr-only" for="article-q">ID atau slug artikel</label>
          <input id="article-q" class="field" bind:value={articleQuery} placeholder="ID atau slug artikel" />
          <Button type="submit" size="lg" disabled={articleLoading || !articleQuery.trim()} class="shrink-0">
            {#if articleLoading}
              <LoaderCircle class="animate-spin" />
            {:else}
              <Search />
            {/if}
            Cari
          </Button>
        </form>

        {#if articleError}
          <Notice class="mt-4">{articleError}</Notice>
        {/if}

        {#if publishedNotice}
          <Notice variant="success" class="mt-4">Artikel berhasil diterbitkan.</Notice>
        {/if}

        {#if article}
          <div class="mt-6 rounded-2xl bg-muted p-5">
            <div class="flex items-start justify-between gap-3">
              <h3 class="font-semibold">{article.title}</h3>
              <span
                class={[
                  'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  article.status === 'PUBLISHED'
                    ? 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                ]}
              >
                {article.status === 'PUBLISHED' ? 'Terbit' : 'Draf'}
              </span>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">
              Oleh {article.author.name}
              {#if article.publishedAt}, terbit {formatDate(article.publishedAt)}{/if}
            </p>
            <p class="mt-3 text-sm leading-relaxed">{excerpt(article.content, 240)}</p>

            <div class="mt-5 flex flex-wrap gap-3">
              {#if article.status !== 'PUBLISHED'}
                <Button onclick={publish} disabled={publishing}>
                  {#if publishing}
                    <LoaderCircle class="animate-spin" /> Menerbitkan…
                  {:else}
                    Terbitkan
                  {/if}
                </Button>
              {/if}
              <Button href={`#/article/${article.slug}`} variant="outline">Buka artikel</Button>
            </div>
          </div>
        {:else if articleSearched}
          <p class="mt-6 text-sm text-muted-foreground">Tidak ada artikel dengan ID atau slug tersebut.</p>
        {/if}
      </section>

      <!-- Users -->
      <section class="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="user-heading">
        <h2 id="user-heading" class="text-xl font-semibold">Cek pengguna</h2>
        <p class="mt-1 text-sm text-muted-foreground">Lihat peran dan izin menulis berdasarkan ID pengguna.</p>

        <form class="mt-6 flex gap-2" onsubmit={lookupUser}>
          <label class="sr-only" for="user-q">ID pengguna</label>
          <input id="user-q" class="field" inputmode="numeric" bind:value={userQuery} placeholder="ID pengguna" />
          <Button type="submit" size="lg" disabled={userLoading || !userQuery.trim()} class="shrink-0">
            {#if userLoading}
              <LoaderCircle class="animate-spin" />
            {:else}
              <Search />
            {/if}
            Cari
          </Button>
        </form>

        {#if userError}
          <Notice class="mt-4">{userError}</Notice>
        {/if}

        {#if user}
          <div class="mt-6 flex items-center gap-4 rounded-2xl bg-muted p-5">
            <Avatar name={user.name} class="size-12 text-base" />
            <div class="min-w-0 flex-1">
              <p class="font-semibold">{user.name}</p>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <RoleBadge role={user.role} />
                <span>{user.canWrite ? 'Boleh menulis' : 'Tidak boleh menulis'}</span>
              </div>
            </div>
            <Button href={`#/user/${user.id}`} variant="outline" size="sm">Profil</Button>
          </div>
        {:else if userSearched}
          <p class="mt-6 text-sm text-muted-foreground">Tidak ada pengguna dengan ID tersebut.</p>
        {/if}
      </section>
    </div>
  {/if}
</div>