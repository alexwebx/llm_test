import { Navigate, Route, Routes } from "react-router-dom";
import { ArticlePage } from "./pages/ArticlePage";
import { ArticlesListPage } from "./pages/ArticlesListPage";
import { FinalTestPage } from "./pages/FinalTestPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticlesListPage />} />
      <Route path="/articles/:articleId" element={<ArticlePage />} />
      <Route path="/test" element={<FinalTestPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
