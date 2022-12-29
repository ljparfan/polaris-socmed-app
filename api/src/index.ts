process.env["NODE_CONFIG_DIR"] = __dirname + "/config";

import "dotenv/config";
import {
  initializeDatabase,
  initializeFirebase,
  initializeRoutes,
} from "./startup";

import { __prod__ } from "./utils/constants";
// import { seedDatabase } from "./utils/dev.utils";
import logger from "./utils/logging.utils";

export const main = async () => {
  await initializeDatabase();
  await initializeFirebase();
  await initializeRoutes();
  // if (!__prod__) {
  //   await seedDatabase(connection);
  // }
};

main().catch((err) => {
  console.error(err);
  logger.error("an error occurred while starting the server:", err);
});
