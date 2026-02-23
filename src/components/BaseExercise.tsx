import { PropsWithChildren, useEffect, useRef } from "react";
import {
  EvaluationResult,
  ExerciseBase,
  ExerciseMode,
  ExerciseViewState
} from "../types/exercises";
import styles from "./BaseExercise.module.css";

interface BaseExerciseProps extends PropsWithChildren {
  exercise: ExerciseBase;
  mode: ExerciseMode;
  state: ExerciseViewState;
  canSubmit: boolean;
  onSubmit: () => void;
  onReset?: () => void;
  onShowAnswer?: () => void;
  feedback?: EvaluationResult | null;
  hint?: string;
}

export function BaseExercise({
  exercise,
  mode,
  state,
  canSubmit,
  onSubmit,
  onReset,
  onShowAnswer,
  feedback,
  hint,
  children
}: BaseExerciseProps) {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback) {
      feedbackRef.current?.focus();
    }
  }, [feedback]);

  const cardClass = [
    styles.card,
    styles[state],
    state === "answered_incorrect" ? styles.shake : ""
  ].join(" ");

  return (
    <section className={cardClass} aria-label={`exercise-${exercise.id}`}>
      <header className={styles.head}>
        <div className={styles.topLine}>
          <span>{mode}</span>
          <span>{exercise.points} pts</span>
        </div>
        <h3 className={styles.prompt}>{exercise.prompt}</h3>
        {exercise.instructions && (
          <p className={styles.instructions}>{exercise.instructions}</p>
        )}
      </header>

      <div>{children}</div>

      <footer className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={onSubmit} disabled={!canSubmit}>
          Submit
        </button>
        {onReset && (
          <button className={styles.btn} type="button" onClick={onReset}>
            Reset
          </button>
        )}
        {onShowAnswer && (
          <button className={styles.btn} type="button" onClick={onShowAnswer}>
            Show answer
          </button>
        )}
      </footer>

      {hint && state === "pristine" && <p className={styles.hint}>Hint: {hint}</p>}

      {feedback && (
        <div ref={feedbackRef} tabIndex={-1} className={styles.feedback} aria-live="polite">
          <strong>
            Score: {feedback.earnedPoints}/{feedback.maxPoints} ({Math.round(feedback.ratio * 100)}%)
          </strong>
          <ul>
            {feedback.feedbackParts.map((part) => (
              <li key={part.key} className={part.ok ? styles.feedbackOk : styles.feedbackBad}>
                {part.message}
              </li>
            ))}
          </ul>
          {exercise.explanation && <p>{exercise.explanation}</p>}
        </div>
      )}
    </section>
  );
}
