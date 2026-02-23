import { Link, useParams } from "react-router-dom";
import { ExerciseRenderer } from "../components/ExerciseRenderer";
import { findArticleById } from "../content/articles";
import page from "./Pages.module.css";

export function ArticlePage() {
  const { articleId } = useParams();
  const article = findArticleById(articleId ?? "");

  if (!article) {
    return (
      <main className={page.page}>
        <h1>Article not found</h1>
        <Link to="/">Back to articles</Link>
      </main>
    );
  }

  const byId = new Map(article.exercises.map((ex) => [ex.id, ex]));

  return (
    <main className={page.page}>
      <Link to="/" className={page.backLink}>
        ← All articles
      </Link>
      <h1>{article.title}</h1>
      <p className={page.summary}>{article.summary}</p>

      {article.blocks.map((block, index) => {
        if (block.type === "section_title") {
          return (
            <h2 className={page.sectionTitle} key={`${article.id}-h-${index}`}>
              {block.text}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p className={page.paragraph} key={`${article.id}-p-${index}`}>
              {block.text}
            </p>
          );
        }

        const exercise = byId.get(block.exerciseId ?? "");
        if (!exercise) return null;

        return <ExerciseRenderer key={exercise.id} exercise={exercise} mode="inline" />;
      })}
    </main>
  );
}
