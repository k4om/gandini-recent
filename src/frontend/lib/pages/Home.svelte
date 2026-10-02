<script>
  import { onMount } from 'svelte'
  import { ArrowRight, PenLine } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import ArticleCard from '$lib/components/ArticleCard.svelte'
  import CardSkeleton from '$lib/components/CardSkeleton.svelte'
  import Cover from '$lib/components/Cover.svelte'
  import Avatar from '$lib/components/Avatar.svelte'
  import Notice from '$lib/components/Notice.svelte'
  import { fetchArticles } from '$lib/api.js'
  import { auth } from '$lib/auth.svelte.js'
  import { formatDate, excerpt, readingTime } from '$lib/format.js'

  let articles = $state([])
  let loading = $state(true)
  let error = $state(null)

  const featured = $derived(articles[0])
  const latest = $derived(articles.slice(1, 7))

  onMount(async () => {
    try {
      articles = await fetchArticles({ limit: 7 })
    } catch (e) {
      error = e.message
    } finally {
      loading = false
    }
  })
</script>

<svelte:head>
  <title>Gandini Recent</title>
</svelte:head>

<div class="container-page pt-10 sm:pt-14">
  <!-- Masthead -->
  <header class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div class="max-w-2xl">
      <h1 class="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
        Kabar terbaru dari sekolah
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        Kegiatan, pengumuman, dan cerita dari siswa dan guru, di satu tempat.
      </p>
    </div>

    {#if auth.canWrite}
      <Button href="#/write" size="lg" class="shrink-0 self-start sm:self-auto">
        <PenLine /> Tulis artikel
      </Button>
    {/if}
  </header>

  {#if loading}
    <!-- Loading -->
    <div class="mt-12 grid animate-pulse gap-8 lg:grid-cols-5" aria-hidden="true">
      <div class="aspect-[4/3] rounded-3xl bg-muted lg:col-span-3"></div>
      <div class="flex flex-col justify-center gap-4 lg:col-span-2">
        <div class="h-4 w-40 rounded bg-muted"></div>
        <div class="h-9 w-full rounded bg-muted"></div>
        <div class="h-9 w-2/3 rounded bg-muted"></div>
        <div class="h-3 w-full rounded bg-muted"></div>
        <div class="h-3 w-5/6 rounded bg-muted"></div>
      </div>
    </div>
    <div class="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(3) as _}
        <CardSkeleton />
      {/each}
    </div>
  {:else if error}
    <Notice class="mt-12">
      <p class="font-medium">Berita belum bisa dimuat.</p>
      <p class="mt-1 opacity-90">{error}</p>
      <button type="button" class="mt-3 font-medium underline underline-offset-4" onclick={() => location.reload()}>
        Muat ulang halaman
      </button>
    </Notice>
  {:else if !featured}
    <div class="mt-12 rounded-3xl border border-dashed p-12 text-center">
      <p class="text-lg font-medium">Belum ada berita yang terbit.</p>
      <p class="mt-2 text-muted-foreground">
        {auth.canWrite
          ? 'Tulis artikel pertama untuk mengisi halaman ini.'
          : 'Kembali lagi nanti untuk melihat kabar terbaru.'}
      </p>
      {#if auth.canWrite}
        <Button href="#/write" class="mt-6">Tulis artikel</Button>
      {/if}
    </div>
  {:else}
    <!-- Lead story -->
    <article class="group relative mt-12 grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
      <Cover
        seed={featured.slug}
        title={featured.title}
        class="aspect-[4/3] rounded-3xl lg:col-span-3"
      />

      <div class="flex flex-col items-start gap-5 lg:col-span-2">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Berita utama
        </span>

        <h2 class="text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
          <a
            href={`#/article/${featured.slug}`}
            class="underline-offset-4 group-hover:underline after:absolute after:inset-0"
          >
            {featured.title}
          </a>
        </h2>

        <p class="text-lg leading-relaxed text-muted-foreground">
          {excerpt(featured.content, 220)}
        </p>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span class="flex items-center gap-2">
            <Avatar name={featured.author.name} />
            <span class="font-medium text-foreground">{featured.author.name}</span>
          </span>
          <span>{formatDate(featured.publishedAt)}</span>
          <span>Bacaan {readingTime(featured.content)} menit</span>
        </div>
      </div>
    </article>

    <!-- Latest -->
    {#if latest.length}
      <section class="mt-20" aria-labelledby="latest-heading">
        <div class="mb-8 flex items-baseline justify-between gap-4 border-b pb-4">
          <h2 id="latest-heading" class="text-2xl font-semibold">Terbaru</h2>
          <a
            href="#/articles"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua berita <ArrowRight class="size-4" />
          </a>
        </div>

        <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {#each latest as article (article.id)}
            <ArticleCard {article} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Contributor prompt -->
    {#if !auth.isLoggedIn}
      <section
        class="mt-24 flex flex-col gap-6 rounded-3xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-12"
      >
        <div class="max-w-xl">
          <h2 class="text-2xl font-semibold sm:text-3xl">Punya kabar dari kegiatanmu?</h2>
          <p class="mt-3 leading-relaxed text-primary-foreground/80">
            Masuk dengan NIS atau akun guru untuk ikut berkomentar, dan menulis artikel jika kamu sudah diberi akses.
          </p>
        </div>
        <Button href="#/login" variant="secondary" size="lg" class="shrink-0 self-start sm:self-auto">
          Masuk
        </Button>
      </section>
    {/if}
  {/if}
</div>
