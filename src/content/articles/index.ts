import { Exercise } from "../../types/exercises";
import { hallucinationsExercises } from "./hallucinations";
import { llmIntuitionExercises } from "./llm-intuition";
import { promptStructureExercises } from "./prompt-structure";

export interface ArticleBlock {
  type: "paragraph" | "exercise" | "section_title";
  text?: string;
  exerciseId?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  blocks: ArticleBlock[];
  exercises: Exercise[];
}

export const articles: Article[] = [
  {
    id: "llm-intuition",
    title: "Как работают LLM (интуитивно)",
    summary: "Почему модель предсказывает токены, а не ищет как Google.",
    exercises: llmIntuitionExercises,
    blocks: [
      {
        type: "section_title",
        text: "1) Что на самом деле делает LLM"
      },
      {
        type: "paragraph",
        text: "LLM не ищет готовый ответ как поисковик. Она предсказывает следующий токен, опираясь на статистические закономерности из обучения и текущий контекст диалога."
      },
      {
        type: "paragraph",
        text: "Поэтому правильнее думать так: вы не 'спрашиваете факт', а 'настраиваете распределение вероятностей' через формулировку запроса."
      },
      {
        type: "paragraph",
        text: "Сначала закрепим базовое различие между моделью и браузером."
      },
      { type: "exercise", exerciseId: "llm-1" },
      {
        type: "section_title",
        text: "2) Управление вариативностью"
      },
      {
        type: "paragraph",
        text: "Параметр temperature регулирует разнообразие вариантов: выше — больше вариативность, ниже — стабильнее и предсказуемее ответы."
      },
      {
        type: "paragraph",
        text: "Для аналитических задач обычно полезно снижать вариативность, а для брейншторма — повышать."
      },
      { type: "exercise", exerciseId: "llm-2" },
      {
        type: "section_title",
        text: "3) Контекстное окно и структура"
      },
      {
        type: "paragraph",
        text: "Контекстное окно ограничено, поэтому важно структурировать запрос и не терять критичные детали."
      },
      {
        type: "paragraph",
        text: "Если важные условия не попали в активный контекст, модель может дать формально грамотный, но practically useless ответ."
      },
      { type: "exercise", exerciseId: "llm-3" },
      {
        type: "paragraph",
        text: "Если вы задаете роль, контекст, ограничения и формат, ответы становятся предсказуемее и полезнее."
      },
      { type: "exercise", exerciseId: "llm-4" },
      { type: "exercise", exerciseId: "llm-5" }
    ]
  },
  {
    id: "hallucinations",
    title: "Галлюцинации и как распознавать",
    summary: "Как отличать убедительный текст от проверяемого ответа.",
    exercises: hallucinationsExercises,
    blocks: [
      {
        type: "section_title",
        text: "1) Что такое галлюцинация"
      },
      {
        type: "paragraph",
        text: "Галлюцинация — это правдоподобная формулировка, которая не подтверждается фактами."
      },
      {
        type: "paragraph",
        text: "Главная опасность в том, что текст звучит уверенно и гладко, поэтому кажется достоверным без проверки."
      },
      {
        type: "paragraph",
        text: "Сначала проверим, отличаете ли вы сигналы риска."
      },
      { type: "exercise", exerciseId: "hal-1" },
      {
        type: "section_title",
        text: "2) Быстрый фактчекинг"
      },
      {
        type: "paragraph",
        text: "Уверенный тон не равен достоверности. Сверяйте даты, имена, цифры и источники."
      },
      {
        type: "paragraph",
        text: "Практическая эвристика: если ответ содержит конкретный факт, у вас должен быть путь его проверить за 1-2 минуты."
      },
      { type: "exercise", exerciseId: "hal-2" },
      { type: "exercise", exerciseId: "hal-3" },
      {
        type: "section_title",
        text: "3) Контроль качества ответа"
      },
      {
        type: "paragraph",
        text: "Лучший способ контроля — требовать источники и явно помечать уровень уверенности."
      },
      {
        type: "paragraph",
        text: "Тренируйтесь выделять в тексте части, которые выглядят подозрительно, и проверяйте их в первую очередь."
      },
      { type: "exercise", exerciseId: "hal-4" },
      { type: "exercise", exerciseId: "hal-5" }
    ]
  },
  {
    id: "prompt-structure",
    title: "Структура эффективного промпта",
    summary: "Role + Context + Constraints + Format как базовый шаблон.",
    exercises: promptStructureExercises,
    blocks: [
      {
        type: "section_title",
        text: "1) Каркас эффективного промпта"
      },
      {
        type: "paragraph",
        text: "Структурный промпт уменьшает неоднозначность и помогает получить стабильный результат."
      },
      {
        type: "paragraph",
        text: "Базовая рамка: Role + Context + Constraints + Output format. Она подходит почти для любой рабочей задачи."
      },
      { type: "exercise", exerciseId: "str-1" },
      {
        type: "section_title",
        text: "2) Роль и контекст"
      },
      {
        type: "paragraph",
        text: "Роль задает перспективу модели, контекст ограничивает область задачи."
      },
      {
        type: "paragraph",
        text: "Без контекста даже хорошая роль не спасает: модель будет заполнять пробелы предположениями."
      },
      { type: "exercise", exerciseId: "str-2" },
      { type: "exercise", exerciseId: "str-3" },
      {
        type: "section_title",
        text: "3) Ограничения, формат и ревью"
      },
      {
        type: "paragraph",
        text: "Добавьте ограничения и формат вывода, чтобы сократить лишний шум в ответе."
      },
      {
        type: "paragraph",
        text: "Финальный шаг — критика черновика промпта: найдите, чего не хватает, прежде чем отправлять его в production."
      },
      { type: "exercise", exerciseId: "str-4" },
      { type: "exercise", exerciseId: "str-5" }
    ]
  }
];

export function findArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
