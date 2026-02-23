import { useMemo, useState } from "react";
import { evaluateAnswer } from "../../core/evaluate";
import {
  EvaluationResult,
  Exercise,
  ExerciseAnswer,
  ExerciseViewState
} from "../../types/exercises";

export function useExerciseEvaluation<TExercise extends Exercise, TAnswer extends ExerciseAnswer>(
  exercise: TExercise,
  answer: TAnswer,
  onResult?: (result: EvaluationResult, answer: TAnswer) => void
) {
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const state: ExerciseViewState = feedback?.state ?? "pristine";

  const submit = () => {
    const result = evaluateAnswer(exercise, answer);
    setFeedback(result);
    if (onResult) onResult(result, answer);
  };

  const reset = () => setFeedback(null);

  const memo = useMemo(
    () => ({ feedback, state, submit, reset }),
    [feedback, state]
  );

  return memo;
}
