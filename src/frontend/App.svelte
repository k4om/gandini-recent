<script>
  import Router from "svelte-spa-router";
  import AppLayout from "./lib/layouts/AppLayout.svelte";
  import routes from "./routes";
</script>

<AppLayout>
  <Router {routes} />
</AppLayout>