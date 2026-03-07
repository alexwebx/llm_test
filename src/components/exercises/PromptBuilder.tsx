import { useEffect, useMemo, useState } from "react";
import { BaseExercise } from "../BaseExercise";
import {
  EvaluationResult,
  ExerciseMode,
  PromptBuilderAnswer,
  PromptBuilderBlockId,
  PromptBuilderExercise
} from "../../types/exercises";
import { evaluateAnswer } from "../../core/evaluate";
import styles from "./ExerciseTypes.module.css";

interface Props {
  exercise: PromptBuilderExercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: PromptBuilderAnswer) => void;
}

function createEmptyBlocks(
  exercise: PromptBuilderExercise
): Partial<Record<PromptBuilderBlockId, string>> {
  return Object.fromEntries(exercise.blocks.map((block) => [block.id, ""])) as Partial<
    Record<PromptBuilderBlockId, string>
  >;
}

export function PromptBuilderExerciseView({ exercise, mode, onResult }: Props) {
  const [blocks, setBlocks] = useState<Partial<Record<PromptBuilderBlockId, string>>>(() =>
    createEmptyBlocks(exercise)
  );
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  const answer = useMemo<PromptBuilderAnswer>(() => ({ blocks }), [blocks]);

  useEffect(() => {
    setBlocks(createEmptyBlocks(exercise));
    setFeedback(null);
  }, [exercise]);

  const canSubmit = exercise.blocks
    .filter((block) => block.required)
    .every((block) => (blocks[block.id] ?? "").trim().length > 0);

  const updateBlock = (blockId: PromptBuilderBlockId, value: string) => {
    setBlocks((prev) => ({ ...prev, [blockId]: value }));
  };

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
      feedback={feedback}
      onSubmit={submit}
      onReset={() => {
        setBlocks(createEmptyBlocks(exercise));
        setFeedback(null);
      }}
      hint="Заполни обязательные блоки: role, context, constraints и format."
    >
      <div className={styles.stack}>
        {exercise.blocks.map((block) => (
          <div className={styles.box} key={block.id}>
            <label className={styles.stack}>
              <span>
                <strong>{block.label}</strong> {block.required ? "*" : ""}
              </span>
              <textarea
                className={styles.input}
                rows={3}
                value={blocks[block.id] ?? ""}
                placeholder={`Опиши блок "${block.label}"`}
                onChange={(event) => updateBlock(block.id, event.currentTarget.value)}
              />
            </label>
          </div>
        ))}
      </div>
    </BaseExercise>
  );
}
