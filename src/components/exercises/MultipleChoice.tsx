import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  MultipleChoiceAnswer,
  MultipleChoiceExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: MultipleChoiceExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: MultipleChoiceAnswer) => void;
}

export function MultipleChoiceExerciseView({ exercise, mode, onResult }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (!exercise.allowMultiple) return [id];
      return prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
    });
  };

  const answer = useMemo<MultipleChoiceAnswer>(() => ({ selectedOptionIds: selected }), [selected]);
  const canSubmit = selected.length > 0;

  const submit = () => {
    const result = evaluateAnswer(exercise, answer);
    setFeedback(result);
    if (onResult) onResult(result, answer);
  };

  return (
    <BaseExercise
      exercise={exercise}
      mode={mode}
      state={feedback?.state ?? "pristine"}
      canSubmit={canSubmit}
      feedback={feedback}
      onSubmit={submit}
      onReset={() => {
        setSelected([]);
        setFeedback(null);
      }}
    >
      <fieldset className={styles.stack}>
        <legend className={styles.dim}>Pick {exercise.allowMultiple ? "one or more" : "one"} options</legend>
        {exercise.options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <label key={option.id} className={styles.optionRow}>
              <input
                type={exercise.allowMultiple ? "checkbox" : "radio"}
                name={exercise.id}
                checked={checked}
                onChange={() => toggle(option.id)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </fieldset>
    </BaseExercise>
  );
}
