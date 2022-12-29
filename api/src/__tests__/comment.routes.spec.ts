import { App } from "firebase-admin/app";
import { Server } from "http";
import request from "supertest";
import { Connection } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Post } from "../entities/post.entity";
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
let testPost: Post;

jest.setTimeout(600000);

describe("/api/posts/1/comments", () => {
  const testUser1 = {
    email: "test1@test.com",
    name: "Test Name 1",
    password: "Qweqwe1@",
    username: "testusername1",
  };

  const createTestUser = async () => {
    await request(server)
      .post("/api/users")
      .field("email", testUser1.email)
      .field("name", testUser1.name)
      .field("password", testUser1.password)
      .field("username", testUser1.username)
      .expect(200);
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

    testPost = Post.create({ userId: 1, value: "test post" });

    const testComment = Comment.create({
      post: { id: 1 },
      userId: 1,
      value: "test comment",
    });

    testPost = await Post.save(testPost);
    await Comment.save(testComment);
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("GET /", () => {
    it("should return 400 if pageSize and pageNumber are not provided", async () => {
      await request(server)
        .get(`/api/posts/${testPost.key}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      await request(server)
        .get(`/api/posts/${testPost.key}/comments`)
        .query({ pageSize: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
    it("should return 200 and successfully return comments in the response body if query parameters are properly provided", async () => {
      await request(server)
        .get(`/api/posts/${testPost.key}/comments`)
        .query({ pageSize: 10, pageNumber: 1 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("POST /", () => {
    it("should return 400 if comment fails validation", async () => {
      await request(server)
        .post(`/api/posts/${testPost.key}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ value: "" })
        .expect(400);
    });
    it("should return 200 if comment passes validation", async () => {
      await request(server)
        .post(`/api/posts/${testPost.key}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ value: "test comment" })
        .expect(200);
    });
  });
  describe("DELETE /:id", () => {
    it("should return 404 if comment with given id is not found", async () => {
      await request(server)
        .delete(`/api/posts/${testPost.key}/comments/10`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    it("should return 200 if comment with given id is valid", async () => {
      const comment = await Comment.findOne(1);
      await request(server)
        .delete(`/api/posts/${testPost.key}/comments/${comment!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});
