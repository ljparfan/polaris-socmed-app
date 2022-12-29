import { App } from "firebase-admin/app";
import { Server } from "http";
import request from "supertest";
import path from "path";
import { Connection } from "typeorm";
import { initializeFirebase } from "../startup";
import { clearFilesInStorage } from "../utils/storage.utils";
import {
  cleanOpenedConnections,
  initializeAppForTesting,
} from "../utils/test.utils";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { Friendship } from "../entities/friendship.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";

let server: Server;
let dbConnection: Connection;
let app: App;
let registerWithPhoto = false;

jest.setTimeout(600000);

describe("/api/profiles", () => {
  const testUser = {
    email: "test@test.com",
    name: "Test Name",
    password: "Qweqwe1@",
    username: "testusername",
  };
  let token: string;
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
    await createTestUser(registerWithPhoto);
    token = (
      await request(server).post("/api/auth").send({
        usernameOrEmail: testUser.username,
        password: testUser.password,
      })
    ).body.accessToken;
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("GET /:username/posts", () => {
    it("should respond with a 400 when pageSize or pageNumber is not provided as query params", async () => {
      await request(server)
        .get(`/api/profiles/${testUser.username}/posts`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get(`/api/profiles/${testUser.username}/posts`)
        .query({ pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should respond with a 404 when user from username params does not exist", async () => {
      await request(server)
        .get(`/api/profiles/${testUser.username}1/posts`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      registerWithPhoto = true;
    });
    it("should return paginated posts of the user", async () => {
      const user = await User.findOne(
        { username: testUser.username },
        { select: ["id"] }
      );
      const post = Post.create({
        userId: user!.id,
        value: "test post",
        photos: [{ id: 1 }],
      });
      await post.save();

      const response = await request(server)
        .get(`/api/profiles/${testUser.username}/posts`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
    });
  });
  describe("GET /:username/friends", () => {
    it("should respond with a 400 when pageSize or pageNumber is not provided as query params", async () => {
      await request(server)
        .get(`/api/profiles/${testUser.username}/friends`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get(`/api/profiles/${testUser.username}/friends`)
        .query({ pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should respond with a 404 when user from username params does not exist", async () => {
      await request(server)
        .get(`/api/profiles/${testUser.username}1/friends`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    it("should respond with all the friends of selected profile when selected profile is not requestee", async () => {
      testUser.username = "another";
      testUser.email = "another@gmail.com";

      await createTestUser();

      const friendship = Friendship.create({
        requesteeId: 1,
        requestorId: 2,
        status: FriendshipStatus.ACCEPTED,
      });

      await friendship.save();

      await request(server)
        .get(`/api/profiles/${testUser.username}/friends`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
    it("should respond with all the friends of selected profile when selected profile is requestee", async () => {
      testUser.username = "another2";
      testUser.email = "another2@gmail.com";

      await createTestUser();

      const friendship = Friendship.create({
        requesteeId: 2,
        requestorId: 1,
        status: FriendshipStatus.ACCEPTED,
      });

      await friendship.save();

      await request(server)
        .get(`/api/profiles/${testUser.username}/friends`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("GET /", () => {
    it("should respond with a 400 when pageSize, pageNumber, or searchQuery is not provided as query params", async () => {
      await request(server)
        .get(`/api/profiles`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get(`/api/profiles`)
        .query({ pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get(`/api/profiles`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should respond successfully when all query parameters are provided", async () => {
      await request(server)
        .get(`/api/profiles`)
        .query({ pageSize: 10, pageNumber: 1, searchQuery: testUser.name })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      registerWithPhoto = true;
    });
    it("should include in the response body the url of profile photo if user has profile photo", async () => {
      await request(server)
        .get(`/api/profiles`)
        .query({ pageSize: 10, pageNumber: 1, searchQuery: testUser.name })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("GET /:username", () => {
    it("should respond with a 404 when user with username from params is not found", async () => {
      await request(server)
        .get(`/api/profiles/${testUser.username}1`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      registerWithPhoto = true;
    });
    it("should respond with a 200 when valid username is passed and when user has profile photo", async () => {
      const response = await request(server)
        .get(`/api/profiles/${testUser.username}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.profilePhotoUrl).toBeTruthy();
    });
  });
});
