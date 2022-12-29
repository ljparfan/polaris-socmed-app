import { App } from "firebase-admin/app";
import { Server } from "http";
import path from "path";
import request from "supertest";
import { Connection } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Friendship } from "../entities/friendship.entity";
import { Post } from "../entities/post.entity";
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

jest.setTimeout(600000);

describe("/api/posts", () => {
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

  const createTestUser = async () => {
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
      .field("email", testUser2.email)
      .field("name", testUser2.name)
      .field("password", testUser2.password)
      .field("username", testUser2.username)
      .expect(200);
    await request(server)
      .post("/api/users")
      .field("email", testUser3.email)
      .field("name", testUser3.name)
      .field("password", testUser3.password)
      .field("username", testUser3.username)
      .expect(200);

    await Friendship.save([
      Friendship.create({
        requesteeId: 1,
        requestorId: 2,
        status: FriendshipStatus.ACCEPTED,
      }),
      Friendship.create({
        requesteeId: 1,
        requestorId: 3,
        status: FriendshipStatus.ACCEPTED,
      }),
      Friendship.create({
        requesteeId: 3,
        requestorId: 2,
        status: FriendshipStatus.ACCEPTED,
      }),
    ]);
  };

  beforeEach(async () => {
    const response = await initializeAppForTesting();
    server = response.server;
    dbConnection = response.dbConnection;
    if (!app) {
      app = await initializeFirebase();
    }
    await createTestUser();
    token = (
      await request(server).post("/api/auth").send({
        usernameOrEmail: testUser1.username,
        password: testUser1.password,
      })
    ).body.accessToken;

    const testPost = Post.create({ userId: 1, value: "test post" });
    const testPost2 = Post.create({
      userId: 2,
      value: "test post 2",
      photos: [{ id: 1 }],
    });
    const testComment = Comment.create({
      post: { id: 1 },
      userId: 1,
      value: "test comment",
    });

    await Post.save([testPost, testPost2]);
    await Comment.save(testComment);
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("GET /", () => {
    it("should return 400 if pageSize and pageNumber are not provided", async () => {
      await request(server)
        .get("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get("/api/posts")
        .query({ pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should return 200 and successfully return posts in the response body if query parameters are properly provided", async () => {
      await request(server)
        .get("/api/posts")
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("POST /", () => {
    it("should return 400 if post fails validation", async () => {
      await request(server)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .attach("photos", path.resolve(__dirname, "./test-photo.png"))
        .field("value", "")
        .expect(400);
    });
    it("should return 200 if post passes validation", async () => {
      await request(server)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .attach("photos", path.resolve(__dirname, "./test-photo.png"))
        .field("value", "test post")
        .expect(200);
    });
  });
  describe("GET /:key", () => {
    it("should return 404 if post with given key is not found", async () => {
      await request(server)
        .get("/api/posts/9a5c8034-e059-4ebf-af91-b776b6dc1688")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    it("should return 200 if post with given key is valid", async () => {
      const post1 = await Post.findOne(1);
      await request(server)
        .get(`/api/posts/${post1!.key}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      const post2 = await Post.findOne(2);
      await request(server)
        .get(`/api/posts/${post2!.key}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("DELETE /:key", () => {
    it("should return 404 if post with given key is not found", async () => {
      await request(server)
        .delete("/api/posts/20")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    it("should return 403 if user deleting the post does not own it", async () => {
      await request(server)
        .delete("/api/posts/2")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });
    it("should return 200 if post exists and user owns it", async () => {
      await request(server)
        .delete("/api/posts/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});
