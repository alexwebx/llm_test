import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  FillTheBlankAnswer,
  FillTheBlankExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: FillTheBlankExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: FillTheBlankAnswer) => void;
}

export function FillTheBlankExerciseView({ exercise, mode, onResult }: Props) {
  const [values, setValues] = useState<string[]>(Array(exercise.blanks.length).fill(""));
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const canSubmit = values.some((v) => v.trim().length > 0);

  const answer = useMemo<FillTheBlankAnswer>(() => ({ values }), [values]);

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
        setValues(Array(exercise.blanks.length).fill(""));
        setFeedback(null);
      }}
    >
      <p>
        {exercise.parts.map((part, index) => (
          <span key={`${exercise.id}-${index}`}>
            {part}
            {index < exercise.blanks.length && (
              <input
                className={styles.input}
                style={{ width: 180, display: "inline-block", margin: "0 6px" }}
                aria-label={`blank-${index + 1}`}
                value={values[index]}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.currentTarget.value;
                  setValues(next);
                }}
              />
            )}
          </span>
        ))}
      </p>
    </BaseExercise>
  );
}
