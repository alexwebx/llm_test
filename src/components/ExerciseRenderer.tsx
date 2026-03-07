import { EvaluationResult, Exercise, ExerciseAnswer, ExerciseMode } from "../types/exercises";
import { CaseStudyExerciseView } from "./exercises/CaseStudy";
import { FillTheBlankExerciseView } from "./exercises/FillTheBlank";
import { MatchPairsExerciseView } from "./exercises/MatchPairs";
import { MultipleChoiceExerciseView } from "./exercises/MultipleChoice";
import { OrderStepsExerciseView } from "./exercises/OrderSteps";
import { PromptBuilderExerciseView } from "./exercises/PromptBuilder";
import { PromptCritiqueExerciseView } from "./exercises/PromptCritique";
import { PromptSimulatorExerciseView } from "./exercises/PromptSimulator";
import { SpotTheHallucinationExerciseView } from "./exercises/SpotTheHallucination";
import { TrueFalseExerciseView } from "./exercises/TrueFalse";

interface Props {
  exercise: Exercise;
  mode: ExerciseMode;
  onResult?: (result: EvaluationResult, answer: ExerciseAnswer) => void;
}

export function ExerciseRenderer({ exercise, mode, onResult }: Props) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoiceExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "match_pairs":
      return <MatchPairsExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "fill_the_blank":
      return <FillTheBlankExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "true_false":
      return <TrueFalseExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "order_steps":
      return <OrderStepsExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "case_study":
      return <CaseStudyExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "prompt_simulator":
      return <PromptSimulatorExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "spot_hallucination":
      return <SpotTheHallucinationExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "prompt_builder":
      return <PromptBuilderExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    case "prompt_critique":
      return <PromptCritiqueExerciseView exercise={exercise} mode={mode} onResult={onResult as never} />;
    default:
      return <div>Unsupported exercise type</div>;
  }
}
