<script>
  import { Button } from "$lib/components/ui/button";
  import { Menu } from "@lucide/svelte";

  let mobileOpen = false;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  const actions = [
    { label: "Sign in", variant: "ghost" },
    { label: "Get Started", variant: "default" },
  ];
</script>

<header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">
    <a href="/" class="block shrink-0" aria-label="Gandini Recent">
      <picture>
        <source
          media="(min-width: 768px)"
          srcset="/icon-with-banner-wide.png"
        />
        <img
          src="/icon-with-banner.png"
          alt="Gandini Recent"
          class="block h-9 w-auto object-contain md:h-10"
        />
      </picture>
    </a>

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

    <div class="hidden items-center gap-3 md:flex">
      {#each actions as action}
        <Button variant={action.variant}>
          {action.label}
        </Button>
      {/each}
    </div>

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

  <div
    class="grid transition-[grid-template-rows] duration-200 md:hidden"
    class:grid-rows-[1fr]={mobileOpen}
    class:grid-rows-[0fr]={!mobileOpen}
  >
    <div class="overflow-hidden">
      <div class="border-t px-4 py-4">
        <nav class="flex flex-col gap-4">
          {#each navItems as item}
            <a
              href={item.href}
              class="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.name}
            </a>
          {/each}

          <div class="flex gap-2 pt-2">
            {#each actions as action}
              <Button variant={action.variant} class="flex-1">
                {action.label}
              </Button>
            {/each}
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
