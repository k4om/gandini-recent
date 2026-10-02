<script>
  import LoginForm from '$lib/components/LoginForm.svelte'
  import { loginStudent } from '$lib/api.js'
</script>

<svelte:head>
  <title>Masuk | Gandini Recent</title>
</svelte:head>

<LoginForm
  title="Masuk"
  subtitle="Siswa masuk dengan NIS dan kata sandi dari sekolah."
  idLabel="NIS"
  idPlaceholder="Contoh: 23010001"
  numeric
  action={loginStudent}
  hint="Akun siswa contoh: NIS 23010002, kata sandi password."
>
  {#snippet footer()}
    <p class="mt-6 text-center text-sm text-muted-foreground">
      Kamu guru?
      <a href="#/login/guru" class="font-medium text-primary underline underline-offset-4">
        Masuk sebagai guru
      </a>
    </p>
  {/snippet}
</LoginForm>