import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  OrderStepsAnswer,
  OrderStepsExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: OrderStepsExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: OrderStepsAnswer) => void;
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function OrderStepsExerciseView({ exercise, mode, onResult }: Props) {
  const [ordered, setOrdered] = useState<string[]>(exercise.steps.map((step) => step.id));
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const canSubmit = ordered.length === exercise.steps.length;

  const answer = useMemo<OrderStepsAnswer>(() => ({ orderedStepIds: ordered }), [ordered]);

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
        setOrdered(exercise.steps.map((step) => step.id));
        setFeedback(null);
      }}
    >
      <p className={styles.dim}>TODO DnD: replace up/down controls with drag handle.</p>
      <ol className={styles.stack}>
        {ordered.map((id, index) => {
          const step = exercise.steps.find((s) => s.id === id);
          if (!step) return null;
          return (
            <li key={id} className={styles.orderItem}>
              <span>
                {index + 1}. {step.label}
              </span>
              <span>
                <button
                  className={styles.buttonSmall}
                  type="button"
                  onClick={() => setOrdered((prev) => move(prev, index, index - 1))}
                  disabled={index === 0}
                >
                  Up
                </button>
                <button
                  className={styles.buttonSmall}
                  type="button"
                  onClick={() => setOrdered((prev) => move(prev, index, index + 1))}
                  disabled={index === ordered.length - 1}
                  style={{ marginLeft: 6 }}
                >
                  Down
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </BaseExercise>
  );
}
