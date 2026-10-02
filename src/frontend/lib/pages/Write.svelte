<script>
  import { LoaderCircle } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import Notice from '$lib/components/Notice.svelte'
  import { createArticle, publishArticle } from '$lib/api.js'
  import { auth } from '$lib/auth.svelte.js'
  import { slugify, readingTime } from '$lib/format.js'

  let title = $state('')
  let slug = $state('')
  let content = $state('')
  let slugTouched = $state(false)

  let saving = $state(false)
  let publishing = $state(false)
  let error = $state(null)
  let created = $state(null)

  // Keep the slug in sync with the title until the author edits it by hand
  $effect(() => {
    if (!slugTouched) slug = slugify(title)
  })

  const canSubmit = $derived(title.trim() && slug.trim() && content.trim() && !saving)

  async function submit(event) {
    event.preventDefault()
    if (!canSubmit) return

    saving = true
    error = null
    try {
      created = await createArticle({
        title: title.trim(),
        slug: slugify(slug) || slugify(title),
        content: content.trim()
      })
    } catch (e) {
      error = /unique/i.test(e.message)
        ? 'Alamat (slug) ini sudah dipakai artikel lain. Ubah slug lalu coba lagi.'
        : e.message
    } finally {
      saving = false
    }
  }

  async function publishNow() {
    publishing = true
    error = null
    try {
      created = await publishArticle(created.id)
    } catch (e) {
      error = e.message
    } finally {
      publishing = false
    }
  }

  function reset() {
    title = ''
    slug = ''
    content = ''
    slugTouched = false
    created = null
    error = null
  }
</script>

<svelte:head>
  <title>Tulis artikel | Gandini Recent</title>
</svelte:head>

<div class="container-page py-10 sm:py-14">
  {#if !auth.isLoggedIn}
    <div class="mx-auto max-w-xl text-center">
      <h1 class="text-3xl font-semibold">Masuk untuk menulis</h1>
      <p class="mt-3 text-muted-foreground">Kamu perlu masuk dulu sebelum bisa menulis artikel.</p>
      <Button href="#/login" class="mt-8">Masuk</Button>
    </div>
  {:else if !auth.canWrite}
    <div class="mx-auto max-w-xl text-center">
      <h1 class="text-3xl font-semibold">Akunmu belum bisa menulis</h1>
      <p class="mt-3 text-muted-foreground">
        Hanya akun yang diberi izin menulis yang bisa membuat artikel. Hubungi guru atau admin sekolah untuk meminta akses.
      </p>
      <Button href="#/" variant="outline" class="mt-8">Kembali ke beranda</Button>
    </div>
  {:else if created}
    <div class="mx-auto max-w-2xl">
      <h1 class="text-3xl font-semibold tracking-tight">Artikel tersimpan</h1>

      <div class="mt-6 rounded-3xl border bg-card p-6 sm:p-8">
        <p class="text-sm text-muted-foreground">
          Status:
          <span class="font-medium text-foreground">
            {created.status === 'PUBLISHED' ? 'Sudah terbit' : 'Draf, menunggu diterbitkan'}
          </span>
        </p>
        <h2 class="mt-3 text-2xl font-semibold">{created.title}</h2>
        <p class="mt-1 text-sm text-muted-foreground">/article/{created.slug}</p>

        {#if error}
          <Notice class="mt-6">{error}</Notice>
        {/if}

        <div class="mt-8 flex flex-wrap gap-3">
          {#if created.status !== 'PUBLISHED'}
            {#if auth.isAdmin}
              <Button onclick={publishNow} disabled={publishing}>
                {#if publishing}
                  <LoaderCircle class="animate-spin" /> Menerbitkan…
                {:else}
                  Terbitkan sekarang
                {/if}
              </Button>
            {:else}
              <p class="w-full text-sm text-muted-foreground">
                Artikel ini akan tampil di beranda setelah admin menerbitkannya.
              </p>
            {/if}
          {/if}

          <Button href={`#/article/${created.slug}`} variant="outline">Lihat artikel</Button>
          <Button variant="ghost" onclick={reset}>Tulis artikel lain</Button>
        </div>
      </div>
    </div>
  {:else}
    <div class="mx-auto max-w-2xl">
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Tulis artikel</h1>
      <p class="mt-2 text-muted-foreground">
        Artikel disimpan sebagai draf dan tampil setelah diterbitkan oleh admin.
      </p>

      <form onsubmit={submit} class="mt-8 flex flex-col gap-6">
        {#if error}
          <Notice>{error}</Notice>
        {/if}

        <div class="flex flex-col gap-2">
          <label for="title" class="text-sm font-medium">Judul</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            required
            maxlength="140"
            class="field text-lg font-medium"
            placeholder="Judul yang singkat dan jelas"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="slug" class="text-sm font-medium">Alamat artikel (slug)</label>
          <input
            id="slug"
            type="text"
            bind:value={slug}
            oninput={() => (slugTouched = true)}
            required
            class="field font-mono text-sm"
          />
          <p class="text-xs text-muted-foreground">
            Dibuat otomatis dari judul. Hanya huruf kecil, angka, dan tanda hubung.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label for="content" class="text-sm font-medium">Isi artikel</label>
          <textarea
            id="content"
            bind:value={content}
            required
            rows="14"
            class="field resize-y leading-relaxed"
            placeholder="Pisahkan paragraf dengan satu baris kosong."
          ></textarea>
          <p class="text-xs text-muted-foreground">
            {content.trim().split(/\s+/).filter(Boolean).length} kata, bacaan sekitar {readingTime(content)} menit
          </p>
        </div>

        <div class="flex justify-end">
          <Button type="submit" size="lg" disabled={!canSubmit}>
            {#if saving}
              <LoaderCircle class="animate-spin" /> Menyimpan…
            {:else}
              Simpan draf
            {/if}
          </Button>
        </div>
      </form>
    </div>
  {/if}
</div>
