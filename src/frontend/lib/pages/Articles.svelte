<script>
  import { onMount } from 'svelte'
  import { Search, LoaderCircle } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import ArticleCard from '$lib/components/ArticleCard.svelte'
  import CardSkeleton from '$lib/components/CardSkeleton.svelte'
  import Notice from '$lib/components/Notice.svelte'
  import { fetchArticles } from '$lib/api.js'

  const PAGE_SIZE = 12

  let articles = $state([])
  let loading = $state(true)
  let loadingMore = $state(false)
  let hasMore = $state(false)
  let error = $state(null)
  let query = $state('')

  // Search runs over the articles loaded so far (the API has no search field)
  const visible = $derived.by(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q)
    )
  })

  async function load(append = false) {
    error = null
    if (append) loadingMore = true
    else loading = true

    try {
      const page = await fetchArticles({
        limit: PAGE_SIZE,
        offset: append ? articles.length : 0
      })
      articles = append ? [...articles, ...page] : page
      hasMore = page.length === PAGE_SIZE
    } catch (e) {
      error = e.message
    } finally {
      loading = false
      loadingMore = false
    }
  }

  onMount(() => load())
</script>

<svelte:head>
  <title>Semua berita | Gandini Recent</title>
</svelte:head>

<div class="container-page pt-10 sm:pt-14">
  <header class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Semua berita</h1>
      <p class="mt-3 text-lg text-muted-foreground">Arsip artikel, dari yang paling baru.</p>
    </div>

    <label class="relative block w-full sm:w-80">
      <span class="sr-only">Cari berita</span>
      <Search
        class="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        bind:value={query}
        placeholder="Cari judul, isi, atau penulis"
        class="field pl-10"
      />
    </label>
  </header>

  <div class="mt-10 border-t pt-10">
    {#if loading}
      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {#each Array(6) as _}
          <CardSkeleton />
        {/each}
      </div>
    {:else if error && !articles.length}
      <Notice>
        <p class="font-medium">Daftar berita belum bisa dimuat.</p>
        <p class="mt-1 opacity-90">{error}</p>
        <button type="button" class="mt-3 font-medium underline underline-offset-4" onclick={() => load()}>
          Coba lagi
        </button>
      </Notice>
    {:else if !articles.length}
      <p class="py-16 text-center text-muted-foreground">Belum ada berita yang terbit.</p>
    {:else if !visible.length}
      <div class="py-16 text-center">
        <p class="font-medium">Tidak ada hasil untuk “{query}”.</p>
        <p class="mt-1 text-muted-foreground">
          {hasMore
            ? 'Pencarian hanya mencakup berita yang sudah dimuat. Muat lebih banyak lalu coba lagi.'
            : 'Coba kata kunci lain.'}
        </p>
      </div>
    {:else}
      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {#each visible as article (article.id)}
          <ArticleCard {article} />
        {/each}
      </div>
    {/if}

    {#if error && articles.length}
      <Notice class="mt-10">{error}</Notice>
    {/if}

    {#if hasMore && !loading}
      <div class="mt-14 flex justify-center">
        <Button variant="outline" size="lg" onclick={() => load(true)} disabled={loadingMore}>
          {#if loadingMore}
            <LoaderCircle class="animate-spin" /> Memuat…
          {:else}
            Muat berita lainnya
          {/if}
        </Button>
      </div>
    {/if}
  </div>
</div>
