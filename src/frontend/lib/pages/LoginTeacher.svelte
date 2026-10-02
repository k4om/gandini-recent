<script>
  import LoginForm from '$lib/components/LoginForm.svelte'
  import { loginTeacher } from '$lib/api.js'
</script>

<svelte:head>
  <title>Masuk guru | Gandini Recent</title>
</svelte:head>

<LoginForm
  title="Masuk guru"
  subtitle="Gunakan nama pengguna dan kata sandi akun guru."
  idLabel="Nama pengguna"
  idPlaceholder="Contoh: guru.rina"
  action={loginTeacher}
  hint="Akun guru contoh: guru.rina, kata sandi password."
>
  {#snippet footer()}
    <p class="mt-6 text-center text-sm text-muted-foreground">
      Kamu siswa?
      <a href="#/login" class="font-medium text-primary underline underline-offset-4">
        Masuk dengan NIS
      </a>
    </p>
  {/snippet}
</LoginForm>