<script>
  import LoginForm from '$lib/components/LoginForm.svelte'
  import { loginAdmin } from '$lib/api.js'
</script>

<svelte:head>
  <title>Masuk admin | Gandini Recent</title>
</svelte:head>

<LoginForm
  title="Masuk admin"
  subtitle="Khusus pengelola situs."
  idLabel="Nama pengguna"
  idPlaceholder="Nama pengguna admin"
  action={loginAdmin}
  redirectTo="/admin"
  hint="Akun contoh: guru.andi (kata sandi password) atau admin (kata sandi admin)."
/>