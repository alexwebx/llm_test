import { Exercise } from "../../types/exercises";

export const promptStructureExercises: Exercise[] = [
  {
    id: "str-1",
    type: "multiple_choice",
    prompt: "Выбери обязательные блоки эффективного промпта",
    allowMultiple: true,
    options: [
      { id: "a", label: "Role", isCorrect: true },
      { id: "b", label: "Context", isCorrect: true },
      { id: "c", label: "Constraints", isCorrect: true },
      { id: "d", label: "Случайный мем", isCorrect: false },
      { id: "e", label: "Output format", isCorrect: true }
    ],
    points: 5,
    analyticsTags: ["prompt-structure"]
  },
  {
    id: "str-2",
    type: "true_false",
    prompt: "Формат ответа можно не указывать, модель сама догадается.",
    statement: "Формат ответа можно не указывать, модель сама догадается.",
    correct: false,
    points: 2,
    analyticsTags: ["prompt-structure"]
  },
  {
    id: "str-3",
    type: "order_steps",
    prompt: "Упорядочь блоки промпта",
    steps: [
      { id: "a", label: "Role" },
      { id: "b", label: "Context" },
      { id: "c", label: "Constraints" },
      { id: "d", label: "Output format" }
    ],
    correctOrder: ["a", "b", "c", "d"],
    points: 4,
    analyticsTags: ["prompt-structure"]
  },
  {
    id: "str-4",
    type: "prompt_builder",
    prompt: "Собери промпт по блокам",
    blocks: [
      {
        id: "role",
        label: "Role",
        required: true,
        keywords: ["эксперт", "аналитик"],
        weight: 2
      },
      {
        id: "context",
        label: "Context",
        required: true,
        keywords: ["данные", "сценарий", "вход"],
        weight: 2
      },
      {
        id: "constraints",
        label: "Constraints",
        required: true,
        keywords: ["не", "ограничение", "лимит"],
        weight: 2
      },
      {
        id: "format",
        label: "Output format",
        required: true,
        keywords: ["json", "таблица", "список"],
        weight: 2
      },
      {
        id: "examples",
        label: "Examples",
        required: false,
        keywords: ["пример"],
        weight: 1
      }
    ],
    points: 9,
    analyticsTags: ["prompt-structure", "prompt-control"]
  },
  {
    id: "str-5",
    type: "prompt_critique",
    prompt: "Определи дефекты черновика",
    promptDraft: "Сделай что-то полезное про продажи, быстро.",
    issues: [
      { id: "p1", label: "Нет роли", isPresent: true, weight: 1.5 },
      { id: "p2", label: "Нет контекста", isPresent: true, weight: 1.5 },
      { id: "p3", label: "Нет формата ответа", isPresent: true, weight: 1.5 },
      { id: "p4", label: "Слишком строгие ограничения", isPresent: false, weight: 1 }
    ],
    points: 6,
    analyticsTags: ["prompt-structure", "critique"]
  }
];
