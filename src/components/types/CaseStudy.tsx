import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  CaseStudyAnswer,
  CaseStudyExercise,
  EvaluationResult,
  ExerciseMode
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: CaseStudyExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: CaseStudyAnswer) => void;
}

export function CaseStudyExerciseView({ exercise, mode, onResult }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<CaseStudyAnswer>(() => ({ selectedImprovementIds: selected }), [selected]);

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
        <strong>Scenario:</strong> {exercise.scenario}
      </div>
      <div className={styles.box}>
        <strong>Bad prompt:</strong> {exercise.badPrompt}
      </div>
      <div className={styles.stack}>
        {exercise.improvements.map((item) => {
          const checked = selected.includes(item.id);
          return (
            <label key={item.id} className={styles.optionRow}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setSelected((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((id) => id !== item.id)
                      : [...prev, item.id]
                  );
                }}
              />
              <span>{item.label}</span>
            </label>
          );
        })}
      </div>
    </BaseExercise>
  );
}
