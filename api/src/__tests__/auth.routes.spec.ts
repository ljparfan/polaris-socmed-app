import { App } from "firebase-admin/app";
import { Server } from "http";
import request from "supertest";
import { Connection } from "typeorm";
import { User } from "../entities/user.entity";
import { initializeFirebase } from "../startup";
import { createRefreshToken } from "../utils/auth.utils";
import { clearFilesInStorage } from "../utils/storage.utils";
import {
  cleanOpenedConnections,
  initializeAppForTesting,
} from "../utils/test.utils";

let server: Server;
let dbConnection: Connection;
let app: App;

jest.setTimeout(600000);

describe("/api/auth", () => {
  const testUser = {
    email: "test@test.com",
    name: "Test Name",
    password: "Qweqwe1@",
    username: "testusername",
  };
  const createTestUser = async () => {
    return request(server).post("/api/users").send(testUser).expect(200);
  };
  beforeEach(async () => {
    const response = await initializeAppForTesting();
    server = response.server;
    dbConnection = response.dbConnection;
    if (!app) {
      app = await initializeFirebase();
    }

    await createTestUser();
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("POST /", () => {
    it("should successfully return accessToken when credentials are valid", async () => {
      const body = {
        usernameOrEmail: testUser.username,
        password: testUser.password,
      };
      const response = await request(server)
        .post("/api/auth")
        .send(body)
        .expect(200);

      expect(response.body.accessToken).toBeTruthy();
    });
    it("should return 400 when username is correct but password is invalid", async () => {
      const body = {
        usernameOrEmail: testUser.username,
        password: `${testUser.password}1`,
      };
      await request(server).post("/api/auth").send(body).expect(400);
    });
    it("should return 400 when username given does not exist", async () => {
      const body = {
        usernameOrEmail: `${testUser.username}1`,
        password: testUser.password,
      };
      await request(server).post("/api/auth").send(body).expect(400);
    });
    it("should return 400 when email given does not exist", async () => {
      const body = {
        usernameOrEmail: `${testUser.email}1`,
        password: testUser.password,
      };
      await request(server).post("/api/auth").send(body).expect(400);
    });
  });
  describe("POST /revoke-refresh-tokens", () => {
    it("should successfully increment tokenVersion of user", async () => {
      const {
        body: { accessToken },
      } = await request(server).post("/api/auth").send({
        usernameOrEmail: testUser.username,
        password: testUser.password,
      });

      const old = await User.findOne(
        { email: testUser.email },
        { select: ["tokenVersion"] }
      );

      const response = await request(server)
        .post("/api/auth/revoke-refresh-tokens")
        .set("Authorization", `Bearer ${accessToken}`);

      const updated = await User.findOne(
        { email: testUser.email },
        { select: ["tokenVersion"] }
      );

      expect(response.body).toBe(true);
      expect(updated!.tokenVersion - old!.tokenVersion).toBe(1);
    });
  });
  describe("POST /access-token", () => {
    it("should return 401 when no jid cookie is passed", async () => {
      await request(server).post("/api/auth/access-token").expect(401);
    });
    it("should return 401 when token is invalid", async () => {
      await request(server)
        .post("/api/auth/access-token")
        .set("Cookie", ["jid=123456"])
        .expect(401);
    });
    it("should return 401 when user id in token is not found", async () => {
      const refreshToken = createRefreshToken(User.create({ id: 99 }));

      await request(server)
        .post("/api/auth/access-token")
        .set("Cookie", [`jid=${refreshToken}`])
        .expect(401);
    });
    it("should return 401 when tokenVersion in refersh token is not the same from value in db", async () => {
      const refreshToken = createRefreshToken(
        User.create({ id: 1, tokenVersion: 99 })
      );

      await request(server)
        .post("/api/auth/access-token")
        .set("Cookie", [`jid=${refreshToken}`])
        .expect(401);
    });
    it("should successfully send in response the accessToken when refreshToken is valid", async () => {
      const user = await User.findOne(1, {
        select: ["id", "tokenVersion"],
      });
      const refreshToken = createRefreshToken(user!);

      const response = await request(server)
        .post("/api/auth/access-token")
        .set("Cookie", [`jid=${refreshToken}`])
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.accessToken).toBeTruthy();
    });
  });
});
