import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  TrueFalseAnswer,
  TrueFalseExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: TrueFalseExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: TrueFalseAnswer) => void;
}

export function TrueFalseExerciseView({ exercise, mode, onResult }: Props) {
  const [value, setValue] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const canSubmit = value !== null;

  const answer = useMemo<TrueFalseAnswer>(() => ({ value }), [value]);

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
        setValue(null);
        setFeedback(null);
      }}
    >
      <p className={styles.box}>{exercise.statement}</p>
      <div className={styles.stack}>
        <label className={styles.optionRow}>
          <input type="radio" checked={value === true} onChange={() => setValue(true)} />
          <span>True</span>
        </label>
        <label className={styles.optionRow}>
          <input type="radio" checked={value === false} onChange={() => setValue(false)} />
          <span>False</span>
        </label>
      </div>
    </BaseExercise>
  );
}
