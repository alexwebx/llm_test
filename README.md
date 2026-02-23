# Prompt Engineering Academy

## Technologies and why
- React + TypeScript: typed component architecture and safe extensibility for exercise types.
- React Router: clear split between articles and test flow.
- CSS Modules: isolated styles per component and maintainable UI states.

## Component architecture
- `src/types/exercises.ts`: all exercise schemas and answer/result contracts.
- `src/core/evaluate.ts`: deterministic evaluator with partial scoring (`0..1`).
- `src/components/BaseExercise.tsx`: shared shell (header/body/footer/feedback).
- `src/components/types/*`: specialized interactive bodies per exercise type.
- `src/components/ExerciseRenderer.tsx`: type-to-component mapping.
- `src/test/TestRunner.tsx`: test mode, reducer state, progress, final summary.

## Run locally
1. `npm i`
2. `npm run dev`
3. Open the URL shown by Vite.

## Deploy to GitHub Pages
1. Push `main` to `git@github.com:alexwebx/llm_test.git`.
2. In GitHub repo settings: `Settings` -> `Pages` -> `Build and deployment` -> `Source: GitHub Actions`.
3. Wait for workflow `Deploy to GitHub Pages` to finish.
4. App URL: `https://alexwebx.github.io/llm_test/`.

## How to use
- Articles: `/` then open any article and complete inline exercises.
- Final test: `/test` for sequential flow with score and recommendations.
- Verify:
  - inline mode keeps local state;
  - test mode aggregates score in reducer;
  - weak-topic recommendations are computed from `analyticsTags`.

## Future improvements
- Replace select/up-down placeholders with full `dnd-kit` drag-and-drop.
- Add persistence (localStorage or backend profile).
- Add per-question timer and anti-skip rules.
- Add instructor dashboard with cohort analytics.
