<script>
  import Cover from './Cover.svelte'
  import Avatar from './Avatar.svelte'
  import { formatDate, excerpt, readingTime } from '$lib/format.js'

  let { article } = $props()
</script>

<article class="group relative flex flex-col gap-4">
  <Cover
    seed={article.slug}
    title={article.title}
    class="aspect-[16/10] rounded-2xl"
  />

  <div class="flex items-center gap-2.5 text-sm text-muted-foreground">
    <Avatar name={article.author.name} />
    <span class="font-medium text-foreground">{article.author.name}</span>
    <span class="ml-auto shrink-0">{formatDate(article.publishedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
  </div>

  <div class="flex flex-col gap-2">
    <h3 class="text-xl leading-snug font-semibold">
      <a
        href={`#/article/${article.slug}`}
        class="underline-offset-4 group-hover:underline after:absolute after:inset-0"
      >
        {article.title}
      </a>
    </h3>
    <p class="line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
      {excerpt(article.content, 180)}
    </p>
    <p class="text-xs text-muted-foreground">
      Bacaan {readingTime(article.content)} menit
    </p>
  </div>
</article>
