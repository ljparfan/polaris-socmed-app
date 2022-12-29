import { App } from "firebase-admin/app";
import { Server } from "http";
import path from "path";
import request from "supertest";
import { Connection } from "typeorm";
import { Friendship } from "../entities/friendship.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";
import { initializeFirebase } from "../startup";
import { clearFilesInStorage } from "../utils/storage.utils";
import {
  cleanOpenedConnections,
  initializeAppForTesting,
} from "../utils/test.utils";

let server: Server;
let dbConnection: Connection;
let app: App;
let token: string;
let registerWithPhoto = false;

jest.setTimeout(600000);

describe("/api/users", () => {
  const testUser1 = {
    email: "test1@test.com",
    name: "Test Name 1",
    password: "Qweqwe1@",
    username: "testusername1",
  };
  const testUser2 = {
    email: "test2@test.com",
    name: "Test Name 2",
    password: "Qweqwe1@",
    username: "testusername2",
  };
  const testUser3 = {
    email: "test3@test.com",
    name: "Test Name 3",
    password: "Qweqwe1@",
    username: "testusername3",
  };
  const createTestUser = async (withPhoto = false) => {
    if (withPhoto) {
      await request(server)
        .post("/api/users")
        .attach("photo", path.resolve(__dirname, "./test-photo.png"))
        .field("email", testUser1.email)
        .field("name", testUser1.name)
        .field("password", testUser1.password)
        .field("username", testUser1.username)
        .expect(200);
      await request(server)
        .post("/api/users")
        .attach("photo", path.resolve(__dirname, "./test-photo.png"))
        .field("email", testUser2.email)
        .field("name", testUser2.name)
        .field("password", testUser2.password)
        .field("username", testUser2.username)
        .expect(200);
      await request(server)
        .post("/api/users")
        .attach("photo", path.resolve(__dirname, "./test-photo.png"))
        .field("email", testUser3.email)
        .field("name", testUser3.name)
        .field("password", testUser3.password)
        .field("username", testUser3.username)
        .expect(200);
    } else {
      await request(server).post("/api/users").send(testUser1).expect(200);
      await request(server).post("/api/users").send(testUser2).expect(200);
      await request(server).post("/api/users").send(testUser3).expect(200);
    }
  };

  beforeEach(async () => {
    const response = await initializeAppForTesting();
    server = response.server;
    dbConnection = response.dbConnection;
    if (!app) {
      app = await initializeFirebase();
    }
    await createTestUser(registerWithPhoto);
    token = (
      await request(server).post("/api/auth").send({
        usernameOrEmail: testUser1.username,
        password: testUser1.password,
      })
    ).body.accessToken;
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("POST /", () => {
    it("should return 400 if requesteeId from request body is empty", async () => {
      await request(server)
        .post("/api/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);
    });
    it("should return 400 if friendship with requesteeId from request body is already present", async () => {
      await Friendship.save(
        Friendship.create({ requesteeId: 2, requestorId: 1 })
      );
      await request(server)
        .post("/api/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesteeId: 2,
        })
        .expect(400);
    });
    it("should create a friend request if requqesteeId is present and no past friendship requests for requestee is present", async () => {
      await request(server)
        .post("/api/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesteeId: 2,
        })
        .expect(200);
    });
  });
  describe("PUT /:id", () => {
    beforeEach(async () => {
      await Friendship.save(
        Friendship.create({ requesteeId: 2, requestorId: 1 })
      );
    });
    it("should return 400 if status from request body is empty", async () => {
      await request(server)
        .put("/api/friendships/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: null })
        .expect(400);
    });
    it("should return 404 if friendship id from params does not exist", async () => {
      await request(server)
        .put("/api/friendships/2")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: FriendshipStatus.ACCEPTED })
        .expect(404);
    });
    it("should return 403 if requesteeId is not equal to current user's id", async () => {
      await request(server)
        .put("/api/friendships/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: FriendshipStatus.ACCEPTED })
        .expect(403);
    });
    it("should return 200 if current user tries to accept friend request sent by another user", async () => {
      token = (
        await request(server).post("/api/auth").send({
          usernameOrEmail: testUser2.username,
          password: testUser2.password,
        })
      ).body.accessToken;
      const response = await request(server)
        .put("/api/friendships/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: FriendshipStatus.ACCEPTED })
        .expect(200);

      expect(response.body.status).toBe(FriendshipStatus.ACCEPTED);
    });
  });
  describe("DELETE /:id", () => {
    beforeEach(async () => {
      await Friendship.save(
        Friendship.create({ requesteeId: 2, requestorId: 1 })
      );
    });
    it("should return 404 if friendship id from params does not exist", async () => {
      await request(server)
        .delete("/api/friendships/2")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    it("should return 403 if current user is neither the requestor nor requestee", async () => {
      token = (
        await request(server).post("/api/auth").send({
          usernameOrEmail: testUser3.username,
          password: testUser3.password,
        })
      ).body.accessToken;
      await request(server)
        .delete("/api/friendships/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });
    it("should return 200 and successfully delete the friendship if it passes all validations", async () => {
      const response = await request(server)
        .delete("/api/friendships/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.deletedAt).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return 400 if status, pageSize, or pageNumber is empty", async () => {
      await request(server)
        .get("/api/friendships")
        .query({})
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get("/api/friendships")
        .query({
          status: FriendshipStatus.ACCEPTED,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get("/api/friendships")
        .query({
          status: FriendshipStatus.ACCEPTED,
          pageSize: 10,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get("/api/friendships")
        .query({
          pageNumber: 1,
          pageSize: 10,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should return received friendship requests of current user with given status", async () => {
      await Friendship.save(
        Friendship.create({
          requestorId: 2,
          requesteeId: 1,
          status: FriendshipStatus.PENDING,
        })
      );
      const response = await request(server)
        .get("/api/friendships")
        .query({
          pageNumber: 1,
          pageSize: 10,
          status: FriendshipStatus.PENDING,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);

      registerWithPhoto = true;
    });
    it("should include user's profile photo in the response when present", async () => {
      await Friendship.save(
        Friendship.create({
          requestorId: 2,
          requesteeId: 1,
          status: FriendshipStatus.PENDING,
        })
      );
      const response = await request(server)
        .get("/api/friendships")
        .query({
          pageNumber: 1,
          pageSize: 10,
          status: FriendshipStatus.PENDING,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data[0].profile.profilePhotoUrl).toBeTruthy();
    });
    it("should not return sent friendship requests of current user", async () => {
      await Friendship.save(
        Friendship.create({
          requestorId: 1,
          requesteeId: 2,
          status: FriendshipStatus.PENDING,
        })
      );
      const response = await request(server)
        .get("/api/friendships")
        .query({
          pageNumber: 1,
          pageSize: 10,
          status: FriendshipStatus.PENDING,
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.length).toBe(0);
    });
  });
});
