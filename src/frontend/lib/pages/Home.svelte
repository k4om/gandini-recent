<script lang="ts">
  let articles = [];
  let loading = true;
  let error = null;

  async function loadArticles() {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query {
            articles(limit: 10) {
              id
              title
              slug
              content
              publishedAt
              author {
                name
                role
              }
            }
          }
        `
      })
    });

    const json = await res.json();

    if (json.errors) {
      error = json.errors[0].message;
    } else {
      articles = json.data.articles;
    }

    loading = false;
  }

  loadArticles();

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(date));
</script>

<svelte:head>
  <title>Gandini Recent</title>
</svelte:head>


<div class="page">

  <section class="hero">
    <p class="eyebrow">
      Gandini Recent
    </p>

    <h1>
      Cerita, informasi,
      <br />
      dan kabar terbaru sekolah.
    </h1>

    <p class="intro">
      Tempat berbagi berita kegiatan, pengumuman,
      dan perkembangan komunitas sekolah.
    </p>
  </section>


  {#if loading}

    <p>Loading...</p>

  {:else if error}

    <p>{error}</p>

  {:else}

    <section class="featured">

      {#if articles[0]}
        <article>
          <div class="meta">
            {articles[0].author.name}
            ·
            {formatDate(articles[0].publishedAt)}
          </div>

          <h2>
            {articles[0].title}
          </h2>

          <p>
            {articles[0].content}
          </p>

          <a href={`/article/${articles[0].slug}`}>
            Baca artikel →
          </a>
        </article>
      {/if}

    </section>


    <section class="latest">

      <h3>
        Terbaru
      </h3>


      <div class="articles">

        {#each articles.slice(1) as article}

          <article>
            <div class="meta">
              {article.author.name}
              ·
              {formatDate(article.publishedAt)}
            </div>

            <h4>
              {article.title}
            </h4>

            <p>
              {article.content}
            </p>

            <a href={`/article/${article.slug}`}>
              Selengkapnya →
            </a>
          </article>

        {/each}

      </div>

    </section>

  {/if}

</div>