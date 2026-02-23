import { Exercise } from "../../types/exercises";

export const hallucinationsExercises: Exercise[] = [
  {
    id: "hal-1",
    type: "multiple_choice",
    prompt: "Признаки вероятной галлюцинации",
    allowMultiple: true,
    penaltyPerExtraWrong: 0.5,
    options: [
      { id: "a", label: "Уверенный тон без ссылок", isCorrect: true },
      { id: "b", label: "Проверяемая ссылка на первоисточник", isCorrect: false },
      { id: "c", label: "Несостыковки в датах", isCorrect: true },
      { id: "d", label: "Ясное указание неопределенности", isCorrect: false }
    ],
    points: 4,
    analyticsTags: ["hallucinations"]
  },
  {
    id: "hal-2",
    type: "true_false",
    prompt: "Уверенный ответ обычно означает, что факт верный.",
    statement: "Уверенный ответ обычно означает, что факт верный.",
    correct: false,
    points: 2,
    analyticsTags: ["hallucinations"]
  },
  {
    id: "hal-3",
    type: "fill_the_blank",
    prompt: "Допиши правило проверки",
    parts: ["Сверяй ", " и ", " перед публикацией ответа."],
    blanks: [
      { id: "b1", acceptedAnswers: ["дату", "даты"] },
      { id: "b2", acceptedAnswers: ["источник", "источники"] }
    ],
    points: 3,
    analyticsTags: ["hallucinations", "fact-check"]
  },
  {
    id: "hal-4",
    type: "spot_hallucination",
    prompt: "Отметь фрагменты с вероятной галлюцинацией",
    passage:
      "Компания Orion основана в 2018. Она выпустила 12 спутников в 1890 и имеет штаб на Марсе.",
    spans: [
      { id: "s1", text: "основана в 2018", isHallucination: false },
      { id: "s2", text: "12 спутников в 1890", isHallucination: true },
      { id: "s3", text: "штаб на Марсе", isHallucination: true }
    ],
    points: 5,
    analyticsTags: ["hallucinations"]
  },
  {
    id: "hal-5",
    type: "case_study",
    prompt: "Улучши проблемный промпт",
    scenario: "Нужно получить проверяемый обзор последних новостей по AI-законодательству.",
    badPrompt: "Расскажи последние новости про AI.",
    improvements: [
      {
        id: "i1",
        label: "Указать период и регион",
        keywords: ["период", "регион"],
        weight: 2,
        isCorrect: true
      },
      {
        id: "i2",
        label: "Запросить ссылки на первоисточники",
        keywords: ["ссылки", "источники"],
        weight: 2,
        isCorrect: true
      },
      {
        id: "i3",
        label: "Добавить формат ответа",
        keywords: ["формат"],
        weight: 1,
        isCorrect: true
      },
      {
        id: "i4",
        label: "Попросить писать увереннее",
        keywords: ["уверенно"],
        weight: 1,
        isCorrect: false
      }
    ],
    points: 7,
    analyticsTags: ["hallucinations", "prompt-structure"]
  }
];
