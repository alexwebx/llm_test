import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  MatchPairsAnswer,
  MatchPairsExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: MatchPairsExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: MatchPairsAnswer) => void;
}

export function MatchPairsExerciseView({ exercise, mode, onResult }: Props) {
  const [pairs, setPairs] = useState<Record<string, string | null>>(
    Object.fromEntries(exercise.leftItems.map((item) => [item.id, null]))
  );
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<MatchPairsAnswer>(() => ({ pairs }), [pairs]);
  const canSubmit = Object.values(pairs).every(Boolean);

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
      onSubmit={submit}
      onReset={() => {
        setPairs(Object.fromEntries(exercise.leftItems.map((item) => [item.id, null])));
        setFeedback(null);
      }}
    >
      <div className={styles.stack}>
        <p className={styles.dim}>TODO DnD: replace selects with dnd-kit sortable columns.</p>
        {exercise.leftItems.map((left) => (
          <div key={left.id} className={styles.grid2}>
            <div className={styles.box}>{left.label}</div>
            <select
              className={styles.input}
              value={pairs[left.id] ?? ""}
              onChange={(event) => {
                const val = event.currentTarget.value || null;
                setPairs((prev) => ({ ...prev, [left.id]: val }));
              }}
            >
              <option value="">Choose pair</option>
              {exercise.rightItems.map((right) => (
                <option key={right.id} value={right.id}>
                  {right.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </BaseExercise>
  );
}
