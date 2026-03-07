export type ExerciseType =
  | "multiple_choice"
  | "match_pairs"
  | "fill_the_blank"
  | "true_false"
  | "order_steps"
  | "case_study"
  | "prompt_simulator"
  | "spot_hallucination"
  | "prompt_builder"
  | "prompt_critique";

export type ExerciseMode = "inline" | "test";

export type ExerciseViewState =
  | "pristine"
  | "answered_correct"
  | "answered_incorrect"
  | "answered_partial";

export interface ModeConfig {
  inline?: {
    showImmediateFeedback?: boolean;
    allowRetry?: boolean;
    maxAttempts?: number;
  };
  test?: {
    allowSkip?: boolean;
    showPerQuestionFeedback?: boolean;
    timeLimitSec?: number;
  };
}

export interface ExerciseBase<TType extends ExerciseType = ExerciseType> {
  id: string;
  type: TType;
  prompt: string;
  instructions?: string;
  explanation?: string;
  points: number;
  modeConfig?: ModeConfig;
  analyticsTags: string[];
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultipleChoiceExercise extends ExerciseBase<"multiple_choice"> {
  allowMultiple: boolean;
  options: MultipleChoiceOption[];
  penaltyPerExtraWrong?: number;
}

export interface MatchPairsExercise extends ExerciseBase<"match_pairs"> {
  leftItems: { id: string; label: string }[];
  rightItems: { id: string; label: string }[];
  correctPairs: Record<string, string>;
}

export interface FillBlankItem {
  id: string;
  acceptedAnswers: string[];
  caseSensitive?: boolean;
}

export interface FillTheBlankExercise extends ExerciseBase<"fill_the_blank"> {
  parts: string[];
  blanks: FillBlankItem[];
}

export interface TrueFalseExercise extends ExerciseBase<"true_false"> {
  statement: string;
  correct: boolean;
}

export interface OrderStepsExercise extends ExerciseBase<"order_steps"> {
  steps: { id: string; label: string }[];
  correctOrder: string[];
}

export interface CaseStudyImprovement {
  id: string;
  label: string;
  keywords: string[];
  weight: number;
  isCorrect: boolean;
}

export interface CaseStudyExercise extends ExerciseBase<"case_study"> {
  scenario: string;
  badPrompt: string;
  improvements: CaseStudyImprovement[];
  penaltyPerWrong?: number;
}

export interface PromptSimulatorStep {
  id: string;
  userMessage: string;
  options: { id: string; label: string; isOptimal: boolean }[];
}

export interface PromptSimulatorExercise extends ExerciseBase<"prompt_simulator"> {
  steps: PromptSimulatorStep[];
}

export interface HallucinationSpan {
  id: string;
  text: string;
  isHallucination: boolean;
}

export interface SpotTheHallucinationExercise
  extends ExerciseBase<"spot_hallucination"> {
  passage: string;
  spans: HallucinationSpan[];
  penaltyPerWrong?: number;
}

export type PromptBuilderBlockId =
  | "role"
  | "context"
  | "constraints"
  | "format"
  | "examples";

export interface PromptBuilderBlock {
  id: PromptBuilderBlockId;
  label: string;
  required: boolean;
  keywords: string[];
  weight: number;
}

export interface PromptBuilderExercise extends ExerciseBase<"prompt_builder"> {
  blocks: PromptBuilderBlock[];
}

export interface PromptIssue {
  id: string;
  label: string;
  isPresent: boolean;
  weight: number;
}

export interface PromptCritiqueExercise extends ExerciseBase<"prompt_critique"> {
  promptDraft: string;
  issues: PromptIssue[];
  penaltyPerWrong?: number;
}

export type Exercise =
  | MultipleChoiceExercise
  | MatchPairsExercise
  | FillTheBlankExercise
  | TrueFalseExercise
  | OrderStepsExercise
  | CaseStudyExercise
  | PromptSimulatorExercise
  | SpotTheHallucinationExercise
  | PromptBuilderExercise
  | PromptCritiqueExercise;

export interface MultipleChoiceAnswer {
  selectedOptionIds: string[];
}

export interface MatchPairsAnswer {
  pairs: Record<string, string | null>;
}

export interface FillTheBlankAnswer {
  values: string[];
}

export interface TrueFalseAnswer {
  value: boolean | null;
}

export interface OrderStepsAnswer {
  orderedStepIds: string[];
}

export interface CaseStudyAnswer {
  selectedImprovementIds: string[];
}

export interface PromptSimulatorAnswer {
  chosenOptionIdsByStep: Record<string, string>;
}

export interface SpotHallucinationAnswer {
  selectedSpanIds: string[];
}

export interface PromptBuilderAnswer {
  blocks: Partial<Record<PromptBuilderBlockId, string>>;
}

export interface PromptCritiqueAnswer {
  selectedIssueIds: string[];
}

export type ExerciseAnswer =
  | MultipleChoiceAnswer
  | MatchPairsAnswer
  | FillTheBlankAnswer
  | TrueFalseAnswer
  | OrderStepsAnswer
  | CaseStudyAnswer
  | PromptSimulatorAnswer
  | SpotHallucinationAnswer
  | PromptBuilderAnswer
  | PromptCritiqueAnswer;

export interface FeedbackPart {
  key: string;
  ok: boolean;
  message: string;
}

export interface EvaluationResult {
  ratio: number;
  maxPoints: number;
  earnedPoints: number;
  isCorrect: boolean;
  state: ExerciseViewState;
  feedbackParts: FeedbackPart[];
}
