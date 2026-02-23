import { Exercise } from "../../types/exercises";

export const llmIntuitionExercises: Exercise[] = [
  {
    id: "llm-1",
    type: "true_false",
    prompt: "LLM по умолчанию ищет в интернете в реальном времени.",
    statement: "LLM по умолчанию ищет в интернете в реальном времени.",
    correct: false,
    points: 2,
    explanation: "Базовый режим — только модель и переданный контекст.",
    analyticsTags: ["llm-basics"]
  },
  {
    id: "llm-2",
    type: "multiple_choice",
    prompt: "Что делает temperature?",
    allowMultiple: false,
    options: [
      { id: "a", label: "Повышает вариативность генерации", isCorrect: true },
      { id: "b", label: "Увеличивает context window", isCorrect: false },
      { id: "c", label: "Гарантирует фактическую точность", isCorrect: false }
    ],
    points: 3,
    analyticsTags: ["llm-basics", "prompt-control"]
  },
  {
    id: "llm-3",
    type: "fill_the_blank",
    prompt: "Заполни пропуски",
    parts: ["LLM генерирует токен по ", " и ограничена размером ", "."],
    blanks: [
      { id: "b1", acceptedAnswers: ["вероятности", "распределению вероятностей"] },
      { id: "b2", acceptedAnswers: ["контекстного окна", "context window"] }
    ],
    points: 4,
    analyticsTags: ["llm-basics"]
  },
  {
    id: "llm-4",
    type: "match_pairs",
    prompt: "Сопоставь термин и смысл",
    leftItems: [
      { id: "l1", label: "Temperature" },
      { id: "l2", label: "Context window" },
      { id: "l3", label: "Token" }
    ],
    rightItems: [
      { id: "r1", label: "Единица текста для генерации" },
      { id: "r2", label: "Диапазон контекста в одном запросе" },
      { id: "r3", label: "Параметр случайности" }
    ],
    correctPairs: { l1: "r3", l2: "r2", l3: "r1" },
    points: 4,
    analyticsTags: ["llm-basics"]
  },
  {
    id: "llm-5",
    type: "order_steps",
    prompt: "Упорядочь этапы написания промпта",
    steps: [
      { id: "s1", label: "Определить цель" },
      { id: "s2", label: "Дать контекст" },
      { id: "s3", label: "Задать ограничения" },
      { id: "s4", label: "Указать формат" }
    ],
    correctOrder: ["s1", "s2", "s3", "s4"],
    points: 5,
    analyticsTags: ["prompt-structure"]
  }
];
