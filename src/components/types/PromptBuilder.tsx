import { useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  PromptBuilderAnswer,
  PromptBuilderExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: PromptBuilderExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: PromptBuilderAnswer) => void;
}

export function PromptBuilderExerciseView({ exercise, mode, onResult }: Props) {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<PromptBuilderAnswer>(() => ({ blocks }), [blocks]);

  const canSubmit = exercise.blocks.some((b) => (blocks[b.id] ?? "").trim().length > 0);

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
        setBlocks({});
        setFeedback(null);
      }}
    >
      <div className={styles.stack}>
        {exercise.blocks.map((block) => (
          <div className={styles.box} key={block.id}>
            <label>
              <strong>{block.label}</strong> {block.required ? "*" : ""}
              <textarea
                className={styles.input}
                rows={3}
                value={blocks[block.id] ?? ""}
                onChange={(event) =>
                  setBlocks((prev) => ({ ...prev, [block.id]: event.currentTarget.value }))
                }
              />
            </label>
          </div>
        ))}
      </div>
    </BaseExercise>
  );
}
