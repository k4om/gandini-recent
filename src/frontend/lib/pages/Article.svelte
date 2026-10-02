<script>
  import { ArrowLeft, LoaderCircle, Send } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Cover from '$lib/components/Cover.svelte'
  import Avatar from '$lib/components/Avatar.svelte'
  import RoleBadge from '$lib/components/RoleBadge.svelte'
  import Notice from '$lib/components/Notice.svelte'
  import { fetchArticle, fetchComments, createComment } from '$lib/api.js'
  import { auth } from '$lib/auth.svelte.js'
  import { formatDate, timeAgo, readingTime, paragraphs } from '$lib/format.js'

  let { params } = $props()

  let article = $state(null)
  let comments = $state([])
  let loading = $state(true)
  let error = $state(null)
  let commentsError = $state(null)

  let draft = $state('')
  let posting = $state(false)
  let postError = $state(null)

  // Guards against out-of-order responses when navigating between articles
  let requestId = 0

  $effect(() => {
    load(params.slug)
  })

  async function load(slug) {
    const current = ++requestId
    loading = true
    error = null
    commentsError = null
    article = null
    comments = []

    try {
      const found = await fetchArticle({ slug })
      if (current !== requestId) return
      article = found
      loading = false
      if (!found) return

      try {
        const list = await fetchComments(found.id)
        if (current === requestId) comments = list
      } catch (e) {
        if (current === requestId) commentsError = e.message
      }
    } catch (e) {
      if (current !== requestId) return
      error = e.message
      loading = false
    }
  }

  async function submitComment(event) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || posting) return

    posting = true
    postError = null
    try {
      await createComment(article.id, content)
      comments = await fetchComments(article.id)
      draft = ''
    } catch (e) {
      postError = e.message
    } finally {
      posting = false
    }
  }
</script>

<svelte:head>
  <title>{article ? `${article.title} | Gandini Recent` : 'Gandini Recent'}</title>
</svelte:head>

<div class="container-page pt-8 sm:pt-12">
  <a
    href="#/articles"
    class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
  >
    <ArrowLeft class="size-4" /> Semua berita
  </a>

  {#if loading}
    <div class="mx-auto mt-10 max-w-3xl animate-pulse space-y-5" aria-hidden="true">
      <div class="h-10 w-full rounded bg-muted"></div>
      <div class="h-10 w-2/3 rounded bg-muted"></div>
      <div class="h-4 w-48 rounded bg-muted"></div>
      <div class="aspect-[16/8] rounded-3xl bg-muted"></div>
      <div class="h-4 rounded bg-muted"></div>
      <div class="h-4 w-5/6 rounded bg-muted"></div>
      <div class="h-4 w-4/6 rounded bg-muted"></div>
    </div>
  {:else if error}
    <Notice class="mx-auto mt-10 max-w-3xl">
      <p class="font-medium">Artikel belum bisa dimuat.</p>
      <p class="mt-1 opacity-90">{error}</p>
    </Notice>
  {:else if !article}
    <div class="mx-auto mt-16 max-w-xl text-center">
      <h1 class="text-3xl font-semibold">Artikel tidak ditemukan</h1>
      <p class="mt-3 text-muted-foreground">
        Tautannya mungkin salah, atau artikel ini sudah dihapus.
      </p>
      <Button href="#/articles" class="mt-8">Lihat semua berita</Button>
    </div>
  {:else}
    <article class="mx-auto mt-8 max-w-3xl">
      {#if article.status !== 'PUBLISHED'}
        <Notice variant="info" class="mb-8">
          Artikel ini masih berstatus draf dan belum tampil di halaman publik.
        </Notice>
      {/if}

      <h1 class="text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
        {article.title}
      </h1>

      <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a href={`#/user/${article.author.id}`} class="flex items-center gap-3 hover:opacity-80">
          <Avatar name={article.author.name} class="size-10 text-sm" />
          <span>
            <span class="block text-sm font-medium">{article.author.name}</span>
            <span class="block text-xs text-muted-foreground">
              {article.publishedAt ? formatDate(article.publishedAt) : 'Belum terbit'}
            </span>
          </span>
        </a>
        <RoleBadge role={article.author.role} />
        <span class="text-sm text-muted-foreground">Bacaan {readingTime(article.content)} menit</span>
      </div>

      <Cover
        seed={article.slug}
        title={article.title}
        class="mt-10 aspect-[16/8] rounded-3xl"
      />

      <div class="article-body mx-auto mt-10">
        {#each paragraphs(article.content) as p}
          <p>{p}</p>
        {/each}
      </div>
    </article>

    <!-- Comments -->
    <section class="mx-auto mt-20 max-w-3xl border-t pt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" class="text-2xl font-semibold">
        Komentar{comments.length ? ` (${comments.length})` : ''}
      </h2>

      {#if auth.isLoggedIn}
        <form onsubmit={submitComment} class="mt-6 flex flex-col gap-3">
          <label class="sr-only" for="comment">Tulis komentar</label>
          <textarea
            id="comment"
            bind:value={draft}
            rows="3"
            maxlength="1000"
            placeholder="Tulis komentar sebagai {auth.user.name}"
            class="field resize-y"
          ></textarea>

          {#if postError}
            <Notice>{postError}</Notice>
          {/if}

          <div class="flex items-center justify-between gap-4">
            <span class="text-xs text-muted-foreground">{draft.length}/1000</span>
            <Button type="submit" disabled={posting || !draft.trim()}>
              {#if posting}
                <LoaderCircle class="animate-spin" /> Mengirim…
              {:else}
                <Send /> Kirim komentar
              {/if}
            </Button>
          </div>
        </form>
      {:else}
        <div class="mt-6 rounded-2xl bg-muted p-5 text-sm">
          <a href="#/login" class="font-medium text-primary underline underline-offset-4">Masuk</a>
          untuk ikut berkomentar.
        </div>
      {/if}

      {#if commentsError}
        <Notice class="mt-8">Komentar belum bisa dimuat: {commentsError}</Notice>
      {:else if !comments.length}
        <p class="mt-8 text-muted-foreground">Belum ada komentar. Jadilah yang pertama.</p>
      {:else}
        <ul class="mt-8 divide-y">
          {#each comments as comment (comment.id)}
            <li class="flex gap-3 py-5 first:pt-0">
              <Avatar name={comment.user.name} class="size-9 text-xs" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a href={`#/user/${comment.user.id}`} class="text-sm font-medium hover:underline">
                    {comment.user.name}
                  </a>
                  <RoleBadge role={comment.user.role} />
                  <span class="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                </div>
                <p class="mt-1.5 text-[0.95rem] leading-relaxed break-words whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</div>
