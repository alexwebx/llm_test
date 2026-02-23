import {
  CaseStudyAnswer,
  CaseStudyExercise,
  EvaluationResult,
  Exercise,
  ExerciseAnswer,
  FillTheBlankAnswer,
  FillTheBlankExercise,
  MatchPairsAnswer,
  MatchPairsExercise,
  MultipleChoiceAnswer,
  MultipleChoiceExercise,
  OrderStepsAnswer,
  OrderStepsExercise,
  PromptBuilderAnswer,
  PromptBuilderExercise,
  PromptCritiqueAnswer,
  PromptCritiqueExercise,
  PromptSimulatorAnswer,
  PromptSimulatorExercise,
  SpotHallucinationAnswer,
  SpotTheHallucinationExercise,
  TrueFalseAnswer,
  TrueFalseExercise
} from "../types/exercises";

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));
const round2 = (n: number): number => Math.round(n * 100) / 100;
const norm = (s: string, caseSensitive = false): string => {
  const t = s.trim();
  return caseSensitive ? t : t.toLowerCase();
};

function evalMultipleChoice(ex: MultipleChoiceExercise, ans: MultipleChoiceAnswer) {
  const selected = new Set(ans.selectedOptionIds);
  const correct = ex.options.filter((o) => o.isCorrect).map((o) => o.id);
  const correctSet = new Set(correct);

  if (!ex.allowMultiple) {
    const ok = correct.length === 1 && selected.has(correct[0]);
    return {
      ratio: ok ? 1 : 0,
      feedbackParts: [{ key: "mc", ok, message: ok ? "Correct" : "Wrong choice" }]
    };
  }

  const tp = [...selected].filter((id) => correctSet.has(id)).length;
  const fp = [...selected].filter((id) => !correctSet.has(id)).length;
  const penalty = ex.penaltyPerExtraWrong ?? 0.5;
  const raw = (tp - penalty * fp) / Math.max(correct.length, 1);
  const ratio = clamp01(raw);

  return {
    ratio,
    feedbackParts: [{ key: "mc", ok: ratio === 1, message: `Correct: ${tp}, extra wrong: ${fp}` }]
  };
}

function evalMatchPairs(ex: MatchPairsExercise, ans: MatchPairsAnswer) {
  const total = ex.leftItems.length;
  let correctCount = 0;

  for (const left of ex.leftItems) {
    if (ans.pairs[left.id] && ans.pairs[left.id] === ex.correctPairs[left.id]) {
      correctCount += 1;
    }
  }

  const ratio = total ? correctCount / total : 0;
  return {
    ratio,
    feedbackParts: [
      { key: "pairs", ok: ratio === 1, message: `Matched: ${correctCount}/${total}` }
    ]
  };
}

function evalFillBlank(ex: FillTheBlankExercise, ans: FillTheBlankAnswer) {
  let ok = 0;

  ex.blanks.forEach((blank, i) => {
    const user = norm(ans.values[i] ?? "", blank.caseSensitive);
    const accepted = blank.acceptedAnswers.map((v) => norm(v, blank.caseSensitive));
    if (accepted.includes(user)) ok += 1;
  });

  const ratio = ex.blanks.length ? ok / ex.blanks.length : 0;
  return {
    ratio,
    feedbackParts: [{ key: "blank", ok: ratio === 1, message: `Blanks: ${ok}/${ex.blanks.length}` }]
  };
}

function evalTrueFalse(ex: TrueFalseExercise, ans: TrueFalseAnswer) {
  const ok = ans.value !== null && ans.value === ex.correct;
  return {
    ratio: ok ? 1 : 0,
    feedbackParts: [{ key: "tf", ok, message: ok ? "Correct" : "Incorrect" }]
  };
}

function pairOrderScore(order: string[], correct: string[]) {
  const pos = new Map(order.map((id, index) => [id, index]));
  let totalPairs = 0;
  let orderedPairs = 0;

  for (let i = 0; i < correct.length; i += 1) {
    for (let j = i + 1; j < correct.length; j += 1) {
      totalPairs += 1;
      const pi = pos.get(correct[i]) ?? -1;
      const pj = pos.get(correct[j]) ?? -1;
      if (pi < pj) orderedPairs += 1;
    }
  }

  return totalPairs ? orderedPairs / totalPairs : 0;
}

function evalOrderSteps(ex: OrderStepsExercise, ans: OrderStepsAnswer) {
  const n = ex.correctOrder.length;
  let positional = 0;

  for (let i = 0; i < n; i += 1) {
    if (ans.orderedStepIds[i] === ex.correctOrder[i]) positional += 1;
  }

  const posRatio = n ? positional / n : 0;
  const relRatio = pairOrderScore(ans.orderedStepIds, ex.correctOrder);
  const ratio = clamp01(0.7 * posRatio + 0.3 * relRatio);

  return {
    ratio,
    feedbackParts: [{ key: "order", ok: ratio === 1, message: `Position matches: ${positional}/${n}` }]
  };
}

function evalCaseStudy(ex: CaseStudyExercise, ans: CaseStudyAnswer) {
  const selected = new Set(ans.selectedImprovementIds);
  const positives = ex.improvements.filter((i) => i.isCorrect);
  const totalWeight = positives.reduce((sum, item) => sum + item.weight, 0) || 1;
  const gained = positives.reduce(
    (sum, item) => sum + (selected.has(item.id) ? item.weight : 0),
    0
  );
  const wrong = ex.improvements.filter((i) => !i.isCorrect && selected.has(i.id)).length;
  const penalty = (ex.penaltyPerWrong ?? 0.2) * wrong;
  const ratio = clamp01(gained / totalWeight - penalty);

  return {
    ratio,
    feedbackParts: [
      { key: "case", ok: ratio === 1, message: `Coverage: ${Math.round(ratio * 100)}%` }
    ]
  };
}

function evalPromptSimulator(ex: PromptSimulatorExercise, ans: PromptSimulatorAnswer) {
  let ok = 0;
  const total = ex.steps.length;

  for (const step of ex.steps) {
    const chosen = ans.chosenOptionIdsByStep[step.id];
    const optimal = step.options.find((o) => o.isOptimal)?.id;
    if (chosen && optimal && chosen === optimal) ok += 1;
  }

  const ratio = total ? ok / total : 0;
  return {
    ratio,
    feedbackParts: [{ key: "sim", ok: ratio === 1, message: `Optimal steps: ${ok}/${total}` }]
  };
}

function evalSpotHallucination(
  ex: SpotTheHallucinationExercise,
  ans: SpotHallucinationAnswer
) {
  const selected = new Set(ans.selectedSpanIds);
  const correctIds = ex.spans.filter((span) => span.isHallucination).map((span) => span.id);
  const correctSet = new Set(correctIds);

  const tp = [...selected].filter((id) => correctSet.has(id)).length;
  const fp = [...selected].filter((id) => !correctSet.has(id)).length;
  const penalty = ex.penaltyPerWrong ?? 0.5;
  const ratio = clamp01((tp - penalty * fp) / Math.max(correctIds.length, 1));

  return {
    ratio,
    feedbackParts: [{ key: "spot", ok: ratio === 1, message: `Found: ${tp}, false flags: ${fp}` }]
  };
}

function evalPromptBuilder(ex: PromptBuilderExercise, ans: PromptBuilderAnswer) {
  const totalWeight = ex.blocks.reduce((sum, block) => sum + block.weight, 0) || 1;
  let gained = 0;

  for (const block of ex.blocks) {
    const value = (ans.blocks[block.id] ?? "").trim().toLowerCase();
    if (!value) continue;
    const hasKeyword = block.keywords.some((k) => value.includes(k.toLowerCase()));
    gained += hasKeyword ? block.weight : block.weight * 0.5;
  }

  const ratio = clamp01(gained / totalWeight);
  return {
    ratio,
    feedbackParts: [
      { key: "builder", ok: ratio === 1, message: `Structural completeness: ${Math.round(ratio * 100)}%` }
    ]
  };
}

function evalPromptCritique(ex: PromptCritiqueExercise, ans: PromptCritiqueAnswer) {
  const selected = new Set(ans.selectedIssueIds);
  const positives = ex.issues.filter((issue) => issue.isPresent);
  const totalWeight = positives.reduce((sum, item) => sum + item.weight, 0) || 1;
  const gained = positives.reduce(
    (sum, item) => sum + (selected.has(item.id) ? item.weight : 0),
    0
  );
  const wrong = ex.issues.filter((issue) => !issue.isPresent && selected.has(issue.id)).length;
  const ratio = clamp01(gained / totalWeight - (ex.penaltyPerWrong ?? 0.25) * wrong);

  return {
    ratio,
    feedbackParts: [
      { key: "critique", ok: ratio === 1, message: `Critique precision: ${Math.round(ratio * 100)}%` }
    ]
  };
}

export function evaluateAnswer(exercise: Exercise, userInput: ExerciseAnswer): EvaluationResult {
  let ratio = 0;
  let feedbackParts: EvaluationResult["feedbackParts"] = [];

  switch (exercise.type) {
    case "multiple_choice":
      ({ ratio, feedbackParts } = evalMultipleChoice(exercise, userInput as MultipleChoiceAnswer));
      break;
    case "match_pairs":
      ({ ratio, feedbackParts } = evalMatchPairs(exercise, userInput as MatchPairsAnswer));
      break;
    case "fill_the_blank":
      ({ ratio, feedbackParts } = evalFillBlank(exercise, userInput as FillTheBlankAnswer));
      break;
    case "true_false":
      ({ ratio, feedbackParts } = evalTrueFalse(exercise, userInput as TrueFalseAnswer));
      break;
    case "order_steps":
      ({ ratio, feedbackParts } = evalOrderSteps(exercise, userInput as OrderStepsAnswer));
      break;
    case "case_study":
      ({ ratio, feedbackParts } = evalCaseStudy(exercise, userInput as CaseStudyAnswer));
      break;
    case "prompt_simulator":
      ({ ratio, feedbackParts } = evalPromptSimulator(exercise, userInput as PromptSimulatorAnswer));
      break;
    case "spot_hallucination":
      ({ ratio, feedbackParts } = evalSpotHallucination(exercise, userInput as SpotHallucinationAnswer));
      break;
    case "prompt_builder":
      ({ ratio, feedbackParts } = evalPromptBuilder(exercise, userInput as PromptBuilderAnswer));
      break;
    case "prompt_critique":
      ({ ratio, feedbackParts } = evalPromptCritique(exercise, userInput as PromptCritiqueAnswer));
      break;
    default:
      ratio = 0;
  }

  ratio = clamp01(ratio);
  const earnedPoints = round2(exercise.points * ratio);
  const state =
    ratio === 1
      ? "answered_correct"
      : ratio > 0
        ? "answered_partial"
        : "answered_incorrect";

  return {
    ratio,
    maxPoints: exercise.points,
    earnedPoints,
    isCorrect: ratio === 1,
    state,
    feedbackParts
  };
}
