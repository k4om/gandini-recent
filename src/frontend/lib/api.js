import { auth } from './auth.svelte.js'

/**
 * Minimal GraphQL client. Throws Error(message) on any failure so pages
 * can just `catch (e) { error = e.message }`.
 */
export async function gql(query, variables = {}) {
  const headers = { 'content-type': 'application/json' }
  if (auth.token) headers.authorization = `Bearer ${auth.token}`

  let res
  try {
    res = await fetch('/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    })
  } catch {
    throw new Error('Tidak bisa terhubung ke server. Periksa koneksi internetmu.')
  }

  let json
  try {
    json = await res.json()
  } catch {
    throw new Error('Server memberi respons yang tidak valid.')
  }

  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

const ARTICLE_FIELDS = `
  id
  title
  slug
  content
  status
  publishedAt
  createdAt
  author { id name role }
`

/* ---------- Articles ---------- */

export async function fetchArticles({ limit = 20, offset = 0 } = {}) {
  const data = await gql(
    `query ($limit: Int, $offset: Int) {
      articles(limit: $limit, offset: $offset) { ${ARTICLE_FIELDS} }
    }`,
    { limit, offset }
  )
  return data.articles
}

/** Pass either { slug } or { id }. Resolves to null when not found. */
export async function fetchArticle({ slug = null, id = null }) {
  const data = await gql(
    `query ($slug: String, $id: ID) {
      article(slug: $slug, id: $id) { ${ARTICLE_FIELDS} }
    }`,
    { slug, id }
  )
  return data.article
}

export async function createArticle({ title, slug, content }) {
  const data = await gql(
    `mutation ($input: ArticleInput!) {
      createArticle(input: $input) { ${ARTICLE_FIELDS} }
    }`,
    { input: { title, slug, content } }
  )
  return data.createArticle
}

export async function publishArticle(id) {
  const data = await gql(
    `mutation ($id: ID!) {
      publishArticle(id: $id) { ${ARTICLE_FIELDS} }
    }`,
    { id }
  )
  return data.publishArticle
}

/* ---------- Comments ---------- */

export async function fetchComments(articleId) {
  const data = await gql(
    `query ($articleId: ID!) {
      comments(articleId: $articleId) {
        id
        content
        createdAt
        user { id name role }
      }
    }`,
    { articleId }
  )
  return data.comments
}

export async function createComment(articleId, content) {
  const data = await gql(
    `mutation ($articleId: ID!, $content: String!) {
      createComment(articleId: $articleId, content: $content) { id }
    }`,
    { articleId, content }
  )
  return data.createComment
}

/* ---------- Users ---------- */

export async function fetchUser(id) {
  const data = await gql(
    `query ($id: ID!) {
      user(id: $id) { id name role canWrite }
    }`,
    { id }
  )
  return data.user
}

/* ---------- Auth (one mutation per account type) ---------- */

const AUTH_FIELDS = `
  token
  user { id name role canWrite }
`

export async function loginStudent(nis, password) {
  const data = await gql(
    `mutation ($nis: Int!, $password: String!) {
      loginStudent(nis: $nis, password: $password) { ${AUTH_FIELDS} }
    }`,
    { nis, password }
  )
  return data.loginStudent
}

export async function loginTeacher(identifier, password) {
  const data = await gql(
    `mutation ($identifier: String!, $password: String!) {
      loginTeacher(identifier: $identifier, password: $password) { ${AUTH_FIELDS} }
    }`,
    { identifier, password }
  )
  return data.loginTeacher
}

export async function loginAdmin(identifier, password) {
  const data = await gql(
    `mutation ($identifier: String!, $password: String!) {
      loginAdmin(identifier: $identifier, password: $password) { ${AUTH_FIELDS} }
    }`,
    { identifier, password }
  )
  return data.loginAdmin
}