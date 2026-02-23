import { createContext, ReactNode, useContext, useMemo, useReducer } from "react";
import { ExerciseRenderer } from "../components/ExerciseRenderer";
import { EvaluationResult, Exercise, ExerciseAnswer } from "../types/exercises";
import styles from "./TestRunner.module.css";

interface TestState {
  startedAt: number;
  finishedAt: number | null;
  currentIndex: number;
  results: Record<string, EvaluationResult>;
}

type TestAction =
  | { type: "SUBMIT_RESULT"; exerciseId: string; result: EvaluationResult }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "FINISH" }
  | { type: "RESET" };

const initialState: TestState = {
  startedAt: Date.now(),
  finishedAt: null,
  currentIndex: 0,
  results: {}
};

function reducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case "SUBMIT_RESULT":
      return {
        ...state,
        results: { ...state.results, [action.exerciseId]: action.result }
      };
    case "NEXT":
      return { ...state, currentIndex: state.currentIndex + 1 };
    case "PREV":
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };
    case "FINISH":
      return { ...state, finishedAt: Date.now() };
    case "RESET":
      return { ...initialState, startedAt: Date.now() };
    default:
      return state;
  }
}

interface TestContextValue {
  state: TestState;
  dispatch: React.Dispatch<TestAction>;
}

const TestContext = createContext<TestContextValue | null>(null);

export function useTestContext(): TestContextValue {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTestContext must be used inside TestRunner");
  }
  return context;
}

interface Props {
  exercises: Exercise[];
  header?: ReactNode;
}

export function TestRunner({ exercises, header }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const total = exercises.length;
  const answeredCount = Object.keys(state.results).length;
  const maxPoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
  const earnedPoints = Object.values(state.results).reduce(
    (sum, r) => sum + r.earnedPoints,
    0
  );

  const currentExercise = exercises[state.currentIndex];
  const done = state.finishedAt !== null;

  const weakTopics = useMemo(() => {
    const tagMap: Record<string, { earned: number; max: number }> = {};

    exercises.forEach((ex) => {
      const result = state.results[ex.id];
      ex.analyticsTags.forEach((tag) => {
        if (!tagMap[tag]) tagMap[tag] = { earned: 0, max: 0 };
        tagMap[tag].max += ex.points;
        if (result) tagMap[tag].earned += result.earnedPoints;
      });
    });

    return Object.entries(tagMap)
      .map(([tag, v]) => ({ tag, ratio: v.max ? v.earned / v.max : 0 }))
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 3);
  }, [exercises, state.results]);

  const progress = total ? Math.round((answeredCount / total) * 100) : 0;
  const durationSec =
    state.finishedAt !== null
      ? Math.round((state.finishedAt - state.startedAt) / 1000)
      : Math.round((Date.now() - state.startedAt) / 1000);

  return (
    <TestContext.Provider value={{ state, dispatch }}>
      <div className={styles.wrapper}>
        {header}
        <div className={styles.top}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.meta}>
            {answeredCount}/{total} answered | {earnedPoints}/{maxPoints} pts | {durationSec}s
          </div>
        </div>

        {!done && currentExercise && (
          <>
            <ExerciseRenderer
              exercise={currentExercise}
              mode="test"
              onResult={(result: EvaluationResult, _answer: ExerciseAnswer) => {
                dispatch({
                  type: "SUBMIT_RESULT",
                  exerciseId: currentExercise.id,
                  result
                });
              }}
            />
            <div className={styles.nav}>
              <button
                className={styles.btn}
                type="button"
                onClick={() => dispatch({ type: "PREV" })}
                disabled={state.currentIndex === 0}
              >
                Previous
              </button>

              {state.currentIndex < total - 1 ? (
                <button
                  className={styles.btn}
                  type="button"
                  onClick={() => dispatch({ type: "NEXT" })}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  type="button"
                  onClick={() => dispatch({ type: "FINISH" })}
                >
                  Finish test
                </button>
              )}
            </div>
          </>
        )}

        {done && (
          <section className={styles.summary}>
            <h2>Final result</h2>
            <p>
              Score: {earnedPoints}/{maxPoints} ({Math.round((earnedPoints / maxPoints) * 100)}%)
            </p>
            <p>Time: {durationSec}s</p>
            <h3>Recommendations</h3>
            <ul>
              {weakTopics.map((topic) => (
                <li key={topic.tag}>
                  {topic.tag}: {Math.round(topic.ratio * 100)}% — revisit this topic
                </li>
              ))}
            </ul>
            <button className={styles.btn} type="button" onClick={() => dispatch({ type: "RESET" })}>
              Retake
            </button>
          </section>
        )}
      </div>
    </TestContext.Provider>
  );
}
