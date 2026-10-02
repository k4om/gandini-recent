import Test from "$lib/pages/Test.svelte";
import Home from "./lib/pages/Home.svelte";
// import Login from "./lib/pages/Login.svelte";
// import Article from "./lib/pages/Article.svelte";

export default {
  "/": Home,
  "/test": Test,
//   "/login": Login,
//   "/article/:id": Article,
};