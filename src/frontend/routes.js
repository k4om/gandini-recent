import Home from './lib/pages/Home.svelte'
import Articles from './lib/pages/Articles.svelte'
import Article from './lib/pages/Article.svelte'
import Profile from './lib/pages/Profile.svelte'
import Login from './lib/pages/Login.svelte'
import LoginTeacher from './lib/pages/LoginTeacher.svelte'
import AdminLogin from './lib/pages/AdminLogin.svelte'
import Write from './lib/pages/Write.svelte'
import Admin from './lib/pages/Admin.svelte'
import NotFound from './lib/pages/NotFound.svelte'

// svelte-spa-router uses hash URLs: /#/articles, /#/article/my-slug, ...
export default {
  '/': Home,
  '/articles': Articles,
  '/article/:slug': Article,
  '/user/:id': Profile,
  '/login': Login,
  '/login/guru': LoginTeacher,
  '/admin/login': AdminLogin,
  '/write': Write,
  '/admin': Admin,
  '*': NotFound
}