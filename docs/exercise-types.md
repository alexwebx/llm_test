# Exercise Types

Документ описывает все поддерживаемые типы упражнений, их входные поля и формат ответа. Основной источник схем остается в [src/types/exercises.ts](/Users/alex/Desktop/incubator/ai/testing/src/types/exercises.ts), но этот файл нужен для быстрого обзора без сканирования всего проекта.

## Общий контракт

Каждое упражнение наследуется от `ExerciseBase` и обязано содержать:

- `id: string` - уникальный идентификатор упражнения.
- `type: ExerciseType` - тип упражнения, по которому `ExerciseRenderer` выбирает UI.
- `prompt: string` - основной вопрос или задача.
- `instructions?: string` - дополнительная инструкция для пользователя.
- `explanation?: string` - пояснение, которое показывается после проверки.
- `points: number` - максимальный балл.
- `modeConfig?: ModeConfig` - опциональные настройки поведения для `inline` и `test`.
- `analyticsTags: string[]` - теги для рекомендаций и аналитики.

Поддерживаемые режимы:

- `inline` - упражнение внутри статьи.
- `test` - упражнение внутри финального теста.

Результат проверки (`EvaluationResult`):

- `ratio: number` - доля правильности от `0` до `1`.
- `maxPoints: number` - максимум баллов за упражнение.
- `earnedPoints: number` - начисленные баллы.
- `isCorrect: boolean` - полностью ли выполнено задание.
- `state` - один из `pristine | answered_correct | answered_incorrect | answered_partial`.
- `feedbackParts` - массив деталей проверки для UI.

## Типы упражнений

### `multiple_choice`

Сценарий: выбор одного или нескольких вариантов.

Поля:

- `allowMultiple: boolean` - разрешает множественный выбор.
- `options: MultipleChoiceOption[]` - варианты ответа.
- `penaltyPerExtraWrong?: number` - штраф за лишний неверный выбор при multiple-select.

`MultipleChoiceOption`:

- `id: string`
- `label: string`
- `isCorrect: boolean`
- `explanation?: string`

Ответ:

- `selectedOptionIds: string[]`

### `match_pairs`

Сценарий: сопоставление левой и правой колонок.

Поля:

- `leftItems: { id: string; label: string }[]`
- `rightItems: { id: string; label: string }[]`
- `correctPairs: Record<string, string>` - словарь `leftItem.id -> rightItem.id`

Ответ:

- `pairs: Record<string, string | null>`

### `fill_the_blank`

Сценарий: вставка значений в пропуски внутри строки.

Поля:

- `parts: string[]` - сегменты текста между инпутами.
- `blanks: FillBlankItem[]` - описание каждого пропуска.

`FillBlankItem`:

- `id: string`
- `acceptedAnswers: string[]` - допустимые ответы.
- `caseSensitive?: boolean`

Ответ:

- `values: string[]`

### `true_false`

Сценарий: бинарная проверка утверждения.

Поля:

- `statement: string`
- `correct: boolean`

Ответ:

- `value: boolean | null`

### `order_steps`

Сценарий: упорядочивание шагов.

Поля:

- `steps: { id: string; label: string }[]`
- `correctOrder: string[]` - массив `step.id` в правильном порядке

Ответ:

- `orderedStepIds: string[]`

### `case_study`

Сценарий: улучшение плохого промпта на основе кейса.

Поля:

- `scenario: string`
- `badPrompt: string`
- `improvements: CaseStudyImprovement[]`
- `penaltyPerWrong?: number`

`CaseStudyImprovement`:

- `id: string`
- `label: string`
- `keywords: string[]`
- `weight: number`
- `isCorrect: boolean`

Ответ:

- `selectedImprovementIds: string[]`

### `prompt_simulator`

Сценарий: выбор лучшего следующего шага по мере уточнения задачи.

Поля:

- `steps: PromptSimulatorStep[]`

`PromptSimulatorStep`:

- `id: string`
- `userMessage: string`
- `options: { id: string; label: string; isOptimal: boolean }[]`

Ответ:

- `chosenOptionIdsByStep: Record<string, string>`

### `spot_hallucination`

Сценарий: поиск недостоверных фрагментов.

Поля:

- `passage: string`
- `spans: HallucinationSpan[]`
- `penaltyPerWrong?: number`

`HallucinationSpan`:

- `id: string`
- `text: string`
- `isHallucination: boolean`

Ответ:

- `selectedSpanIds: string[]`

### `prompt_builder`

Сценарий: сборка production-ready промпта по блокам.

Поля:

- `blocks: PromptBuilderBlock[]`

`PromptBuilderBlock`:

- `id: "role" | "context" | "constraints" | "format" | "examples"`
- `label: string`
- `required: boolean`
- `keywords: string[]` - используются текущим evaluator для грубой проверки полноты.
- `weight: number`

Ответ:

- `blocks: Partial<Record<PromptBuilderBlockId, string>>`

Замечания по UI:

- В текущей реализации submit доступен только после заполнения всех обязательных блоков.
- Состояние блоков сбрасывается при смене упражнения и по `Reset`.

### `prompt_critique`

Сценарий: аудит черновика промпта.

Поля:

- `promptDraft: string`
- `issues: PromptIssue[]`
- `penaltyPerWrong?: number`

`PromptIssue`:

- `id: string`
- `label: string`
- `isPresent: boolean`
- `weight: number`

Ответ:

- `selectedIssueIds: string[]`

## Где что лежит

- [src/types/exercises.ts](/Users/alex/Desktop/incubator/ai/testing/src/types/exercises.ts) - схемы упражнений, ответов и результатов.
- [src/core/evaluate.ts](/Users/alex/Desktop/incubator/ai/testing/src/core/evaluate.ts) - логика оценки.
- [src/components/BaseExercise.tsx](/Users/alex/Desktop/incubator/ai/testing/src/components/BaseExercise.tsx) - общая обертка карточки упражнения.
- [src/components/exercises](/Users/alex/Desktop/incubator/ai/testing/src/components/exercises) - специализированные UI-компоненты по типам.
- [src/components/ExerciseRenderer.tsx](/Users/alex/Desktop/incubator/ai/testing/src/components/ExerciseRenderer.tsx) - роутинг `type -> component`.
- [src/test/TestRunner.tsx](/Users/alex/Desktop/incubator/ai/testing/src/test/TestRunner.tsx) - сценарий прохождения итогового теста.
