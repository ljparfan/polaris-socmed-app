import { Server } from "http";
import { Connection } from "typeorm";
import { initializeDatabase, initializeRoutes } from "../startup";
import { clearFilesInStorage } from "./storage.utils";

export const initializeAppForTesting = async () => {
  const dbConnection = await initializeDatabase();
  await dbConnection.dropDatabase();
  await dbConnection.synchronize();

  const server = await initializeRoutes();

  return {
    dbConnection,
    server,
  };
};

export const cleanOpenedConnections = async ({
  dbConnection,
  server,
}: {
  server: Server;
  dbConnection: Connection;
}) => {
  await dbConnection.close();
  await server.close();
  await clearFilesInStorage();
};
