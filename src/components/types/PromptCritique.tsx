import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  PromptCritiqueAnswer,
  PromptCritiqueExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: PromptCritiqueExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: PromptCritiqueAnswer) => void;
}

export function PromptCritiqueExerciseView({ exercise, mode, onResult }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<PromptCritiqueAnswer>(() => ({ selectedIssueIds: selected }), [selected]);

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
      canSubmit={selected.length > 0}
      onSubmit={submit}
      onReset={() => {
        setSelected([]);
        setFeedback(null);
      }}
    >
      <div className={`${styles.box} ${styles.warn}`}>
        <strong>Prompt draft:</strong> {exercise.promptDraft}
      </div>
      <div className={styles.stack}>
        {exercise.issues.map((issue) => {
          const checked = selected.includes(issue.id);
          return (
            <label className={styles.optionRow} key={issue.id}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setSelected((prev) =>
                    prev.includes(issue.id)
                      ? prev.filter((id) => id !== issue.id)
                      : [...prev, issue.id]
                  );
                }}
              />
              <span>{issue.label}</span>
            </label>
          );
        })}
      </div>
    </BaseExercise>
  );
}
