import { Exercise } from "../../types/exercises";

export const finalTestExercises: Exercise[] = [
  {
    id: "ft-1",
    type: "multiple_choice",
    prompt: "Что снижает риск галлюцинаций?",
    allowMultiple: true,
    options: [
      { id: "a", label: "Четкий контекст", isCorrect: true },
      { id: "b", label: "Требование источников", isCorrect: true },
      { id: "c", label: "Максимально общий запрос", isCorrect: false }
    ],
    points: 4,
    analyticsTags: ["hallucinations", "prompt-control"]
  },
  {
    id: "ft-2",
    type: "true_false",
    prompt: "LLM всегда понимает, где у нее не хватает данных.",
    statement: "LLM всегда понимает, где у нее не хватает данных.",
    correct: false,
    points: 2,
    analyticsTags: ["llm-basics"]
  },
  {
    id: "ft-3",
    type: "fill_the_blank",
    prompt: "Заполни пропуски",
    parts: ["Хороший промпт: ", " + ", " + ограничения + формат."],
    blanks: [
      { id: "b1", acceptedAnswers: ["роль"] },
      { id: "b2", acceptedAnswers: ["контекст"] }
    ],
    points: 3,
    analyticsTags: ["prompt-structure"]
  },
  {
    id: "ft-4",
    type: "match_pairs",
    prompt: "Сопоставь проблему и действие",
    leftItems: [
      { id: "l1", label: "Нечеткий ответ" },
      { id: "l2", label: "Подозрительный факт" }
    ],
    rightItems: [
      { id: "r1", label: "Задать формат и критерии" },
      { id: "r2", label: "Запросить источник и дату" }
    ],
    correctPairs: { l1: "r1", l2: "r2" },
    points: 4,
    analyticsTags: ["prompt-control", "hallucinations"]
  },
  {
    id: "ft-5",
    type: "order_steps",
    prompt: "Порядок написания промпта",
    steps: [
      { id: "s1", label: "Цель" },
      { id: "s2", label: "Роль" },
      { id: "s3", label: "Контекст" },
      { id: "s4", label: "Ограничения и формат" }
    ],
    correctOrder: ["s1", "s2", "s3", "s4"],
    points: 4,
    analyticsTags: ["prompt-structure"]
  },
  {
    id: "ft-6",
    type: "spot_hallucination",
    prompt: "Отметь неверные фрагменты",
    passage: "Компания Nova основана в 2012. Ее CEO — Никола Тесла в 2025.",
    spans: [
      { id: "s1", text: "основана в 2012", isHallucination: false },
      { id: "s2", text: "CEO — Никола Тесла в 2025", isHallucination: true }
    ],
    points: 5,
    analyticsTags: ["hallucinations"]
  },
  {
    id: "ft-7",
    type: "case_study",
    prompt: "Улучши промпт для аналитического отчета",
    scenario: "Требуется краткий и проверяемый отчет по рынку AI-инструментов.",
    badPrompt: "Расскажи все про AI-рынок.",
    improvements: [
      {
        id: "i1",
        label: "Указать роль аналитика",
        keywords: ["роль", "аналитик"],
        weight: 2,
        isCorrect: true
      },
      {
        id: "i2",
        label: "Ограничить временной период",
        keywords: ["период"],
        weight: 2,
        isCorrect: true
      },
      {
        id: "i3",
        label: "Попросить ссылки на источники",
        keywords: ["источники", "ссылки"],
        weight: 2,
        isCorrect: true
      },
      {
        id: "i4",
        label: "Сделать тон максимально уверенным",
        keywords: ["уверенно"],
        weight: 1,
        isCorrect: false
      }
    ],
    points: 8,
    analyticsTags: ["case-study", "prompt-structure"]
  },
  {
    id: "ft-8",
    type: "prompt_builder",
    prompt: "Собери production-ready промпт",
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
        keywords: ["данные", "контекст"],
        weight: 2
      },
      {
        id: "constraints",
        label: "Constraints",
        required: true,
        keywords: ["не", "ограничения"],
        weight: 2
      },
      {
        id: "format",
        label: "Format",
        required: true,
        keywords: ["json", "таблица"],
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
    analyticsTags: ["prompt-builder", "prompt-structure"]
  },
  {
    id: "ft-9",
    type: "prompt_simulator",
    prompt: "Выбери лучший следующий шаг",
    steps: [
      {
        id: "st1",
        userMessage: "Сделай отчет по рынку AI.",
        options: [
          { id: "o1", label: "Уточнить цель, аудиторию и формат", isOptimal: true },
          { id: "o2", label: "Сразу выдать длинный общий текст", isOptimal: false }
        ]
      },
      {
        id: "st2",
        userMessage: "Нужен краткий отчет для менеджера.",
        options: [
          { id: "o3", label: "Запросить ограничения и список источников", isOptimal: true },
          { id: "o4", label: "Игнорировать ограничения", isOptimal: false }
        ]
      }
    ],
    points: 6,
    analyticsTags: ["simulation", "prompt-control"]
  },
  {
    id: "ft-10",
    type: "prompt_critique",
    prompt: "Найди проблемы в промпте",
    promptDraft: "Напиши что-нибудь полезное про бизнес.",
    issues: [
      { id: "q1", label: "Нет цели", isPresent: true, weight: 1.5 },
      { id: "q2", label: "Нет формата результата", isPresent: true, weight: 1.5 },
      { id: "q3", label: "Нет ограничений", isPresent: true, weight: 1.5 },
      { id: "q4", label: "Есть четкая роль", isPresent: false, weight: 1 }
    ],
    points: 6,
    analyticsTags: ["critique", "prompt-structure"]
  }
];
