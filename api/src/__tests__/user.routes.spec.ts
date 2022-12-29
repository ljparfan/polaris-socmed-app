import { ValidationError } from "class-validator";
import { App } from "firebase-admin/app";
import { Server } from "http";
import path from "path";
import request from "supertest";
import { Connection } from "typeorm";
import { User } from "../entities/user.entity";
import { initializeFirebase } from "../startup";
import { clearFilesInStorage } from "../utils/storage.utils";
import { createAccessToken } from "../utils/auth.utils";
import {
  cleanOpenedConnections,
  initializeAppForTesting,
} from "../utils/test.utils";

let server: Server;
let dbConnection: Connection;
let app: App;

jest.setTimeout(600000);

describe("/api/users", () => {
  const testUser = {
    email: "test@test.com",
    name: "Test Name",
    password: "Qweqwe1@",
    username: "testusername",
  };
  const createTestUser = (withPhoto = false) => {
    if (withPhoto) {
      return request(server)
        .post("/api/users")
        .attach("photo", path.resolve(__dirname, "./test-photo.png"))
        .field("email", testUser.email)
        .field("name", testUser.name)
        .field("password", testUser.password)
        .field("username", testUser.username)
        .expect(200);
    }
    const body = {
      ...testUser,
    };
    return request(server).post("/api/users").send(body).expect(200);
  };

  beforeEach(async () => {
    const response = await initializeAppForTesting();
    server = response.server;
    dbConnection = response.dbConnection;
    if (!app) {
      app = await initializeFirebase();
    }
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("POST /", () => {
    it("should successfully create a user without photo", async () => {
      const response = await createTestUser(false);

      expect(response.body.profilePhotoUrl).toBeFalsy();
      expect(response.body.username).toBeTruthy();
      expect(response.body.password).toBeFalsy();
    });
    it("should successfully create a user with photo", async () => {
      const response = await createTestUser(true);

      expect(response.body.profilePhoto).toBeTruthy();
      expect(response.body.username).toBeTruthy();
      expect(response.body.password).toBeFalsy();
    });
    it("should handle validation errors when creating a user", async () => {
      const body = {
        email: "test",
        name: "Test Name",
        password: "qweqwe1",
        username: "a",
      };
      const response = await request(server)
        .post("/api/users")
        .send(body)
        .expect(400);

      expect(
        response.body.validationErrors.some(
          (error: ValidationError) => error.property === "username"
        )
      ).toBeTruthy();
      expect(
        response.body.validationErrors.some(
          (error: ValidationError) => error.property === "email"
        )
      ).toBeTruthy();
      expect(
        response.body.validationErrors.some(
          (error: ValidationError) => error.property === "password"
        )
      ).toBeTruthy();
    });
  });
  describe("GET /me", () => {
    it("should successfully return current user when id in token is valid without photo", async () => {
      const registerResponse = await createTestUser();

      const token = createAccessToken(
        User.create({ id: registerResponse.body.id })
      );

      const response = await request(server)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
    });
    it("should successfully return current user when id in token is valid with photo", async () => {
      const registerResponse = await createTestUser(true);

      const token = createAccessToken(
        User.create({ id: registerResponse.body.id })
      );

      const response = await request(server)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.profilePhotoUrl).toBeTruthy();
      expect(response.body.password).toBeFalsy();
      expect(response.body.tokenVersion).toBeFalsy();
    });
    it("should return 401 when id in token does not exist in db", async () => {
      const token = createAccessToken(User.create({ id: 1 }));

      await request(server)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });
});
