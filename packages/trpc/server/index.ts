import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { formRouter } from "./routes/form/route";

export const serverRouter = router({
  health: healthRouter,
  form: formRouter
});

export { createContext } from "./context";
export { auth } from "./auth";
export type ServerRouter = typeof serverRouter;

