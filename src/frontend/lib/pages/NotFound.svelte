<script>
  import { Button } from '$lib/components/ui/button'
</script>

<svelte:head>
  <title>Halaman tidak ditemukan | Gandini Recent</title>
</svelte:head>

<div class="container-page py-24 sm:py-32">
  <div class="mx-auto max-w-xl text-center">
    <p class="text-7xl font-semibold tracking-tighter text-primary">404</p>
    <h1 class="mt-6 text-3xl font-semibold">Halaman tidak ditemukan</h1>
    <p class="mt-3 text-muted-foreground">
      Alamat yang kamu buka tidak ada. Coba cek tautannya, atau mulai dari beranda.
    </p>
    <div class="mt-8 flex justify-center gap-3">
      <Button href="#/">Ke beranda</Button>
      <Button href="#/articles" variant="outline">Semua berita</Button>
    </div>
  </div>
</div>
