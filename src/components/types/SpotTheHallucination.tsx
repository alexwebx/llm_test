import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  SpotHallucinationAnswer,
  SpotTheHallucinationExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: SpotTheHallucinationExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: SpotHallucinationAnswer) => void;
}

export function SpotTheHallucinationExerciseView({
  exercise,
  mode,
  onResult
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<SpotHallucinationAnswer>(() => ({ selectedSpanIds: selected }), [selected]);

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
      <p className={styles.box}>{exercise.passage}</p>
      <div className={styles.stack}>
        {exercise.spans.map((span) => {
          const checked = selected.includes(span.id);
          return (
            <label className={styles.optionRow} key={span.id}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setSelected((prev) =>
                    prev.includes(span.id)
                      ? prev.filter((id) => id !== span.id)
                      : [...prev, span.id]
                  );
                }}
              />
              <span>{span.text}</span>
            </label>
          );
        })}
      </div>
    </BaseExercise>
  );
}
