import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  PromptSimulatorAnswer,
  PromptSimulatorExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: PromptSimulatorExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: PromptSimulatorAnswer) => void;
}

export function PromptSimulatorExerciseView({ exercise, mode, onResult }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<PromptSimulatorAnswer>(
    () => ({ chosenOptionIdsByStep: answers }),
    [answers]
  );
  const canSubmit = exercise.steps.every((step) => Boolean(answers[step.id]));

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
        setAnswers({});
        setFeedback(null);
      }}
    >
      <div className={styles.stack}>
        {exercise.steps.map((step, index) => (
          <div className={styles.box} key={step.id}>
            <p>
              <strong>Step {index + 1}:</strong> {step.userMessage}
            </p>
            {step.options.map((option) => (
              <label key={option.id} className={styles.optionRow}>
                <input
                  type="radio"
                  name={`${exercise.id}-${step.id}`}
                  checked={answers[step.id] === option.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [step.id]: option.id }))}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </BaseExercise>
  );
}
