import { Link } from "react-router-dom";
import { articles } from "../content/articles";
import page from "./Pages.module.css";

export function ArticlesListPage() {
  return (
    <main className={page.page}>
      <section className={page.hero}>
        <p className={page.kicker}>Prompt Engineering Academy</p>
        <h1>Learn prompting by doing, not by reading only</h1>
        <p>
          Each concept has immediate inline exercises and deterministic feedback.
          Then you can take the final test with score, progress, and recommendations.
        </p>
        <Link className={page.action} to="/test">
          Open final test
        </Link>
      </section>

      <section className={page.list}>
        {articles.map((article) => (
          <article key={article.id} className={page.card}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <Link to={`/articles/${article.id}`}>Open article</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
