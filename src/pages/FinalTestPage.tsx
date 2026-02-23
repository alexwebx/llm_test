import { TestRunner } from "../test/TestRunner";
import { finalTestExercises } from "../content/tests/finalTest";
import page from "./Pages.module.css";

export function FinalTestPage() {
  return (
    <main className={page.page}>
      <TestRunner
        exercises={finalTestExercises}
        header={
          <header className={page.heroTest}>
            <p className={page.kicker}>Final Test</p>
            <h1>Prompt Engineering Assessment</h1>
            <p>
              Flow: start → solve exercises → finish → get score and weak-topic recommendations.
            </p>
          </header>
        }
      />
    </main>
  );
}
