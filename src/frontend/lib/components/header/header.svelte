<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Menu } from "@lucide/svelte";

  let mobileOpen = false;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];
</script>

<header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">
    <!-- Logo -->
    <a href="/" class="block shrink-0" aria-label="Gandini Recent">
      <picture>
        <!-- Wide screens -->
        <source media="(min-width: 768px)" srcset="/icon-with-banner-wide.png" />

        <!-- Mobile / narrow screens -->
        <img
          src="/icon-with-banner.png"
          alt="Gandini Recent"
          class="block h-9 w-auto object-contain md:h-10"
        />
      </picture>
    </a>

    <!-- Desktop navigation -->
    <nav class="hidden items-center gap-6 md:flex">
      {#each navItems as item}
        <a
          href={item.href}
          class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.name}
        </a>
      {/each}
    </nav>

    <!-- Actions -->
    <!-- <div class="hidden items-center gap-3 md:flex">
      <Button variant="ghost">Sign in</Button>

      <Button>Get Started</Button>
    </div> -->

    <!-- Mobile menu button -->
    <Button
      variant="ghost"
      size="icon"
      class="md:hidden"
      onclick={() => (mobileOpen = !mobileOpen)}
    >
      <Menu class="h-5 w-5" />
      <span class="sr-only">Toggle menu</span>
    </Button>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div class="border-t px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-4">
        {#each navItems as item}
          <a
            href={item.href}
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            {item.name}
          </a>
        {/each}

        <!-- <div class="flex gap-2 pt-2">
          <Button variant="ghost" class="flex-1">Sign in</Button>

          <Button class="flex-1">Get Started</Button>
        </div> -->
      </nav>
    </div>
  {/if}
</header>
