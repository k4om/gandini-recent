<script>
  import { Button } from '$lib/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card'
  
  let users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ]

  import { Header } from "$components/header"
</script>


<Header />

<div class="min-h-screen bg-background">
  <main class="mx-auto max-w-5xl px-6 py-12">

    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Users
        </h1>

        <p class="mt-1 text-muted-foreground">
          Manage your users and their profiles.
        </p>
      </div>

      <Button>
        Add user
      </Button>
    </div>

    <!-- Users -->
    <div class="grid gap-4 md:grid-cols-2">
      {#each users as user}
        <Card class="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>

            <CardDescription>
              {user.email}
            </CardDescription>
          </CardHeader>

          <CardContent class="flex justify-end">
            <Button variant="outline">
              View profile
            </Button>
          </CardContent>
        </Card>
      {/each}
    </div>

  </main>
</div>