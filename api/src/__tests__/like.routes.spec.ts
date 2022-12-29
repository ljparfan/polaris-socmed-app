import { App } from "firebase-admin/app";
import { Server } from "http";
import path from "path";
import request from "supertest";
import { Connection } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Like } from "../entities/like.entity";
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

jest.setTimeout(600000);

describe("/api/likes", () => {
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
    const testComment = Comment.create({
      post: { id: 1 },
      userId: 1,
      value: "test comment",
    });

    await Post.save(testPost);
    await Comment.save(testComment);
  });
  afterEach(async () => {
    await cleanOpenedConnections({ dbConnection, server });
    await clearFilesInStorage();
  });
  describe("POST /", () => {
    it("should return 404 if postId from request body is non existent", async () => {
      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          postId: 10,
        })
        .expect(404);
    });
    it("should return 404 if commentId from request body is non existent", async () => {
      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          commentId: 10,
        })
        .expect(404);
    });
    it("should return add a new post entry in the db if postId is valid", async () => {
      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          postId: 1,
        })
        .expect(200);

      const createdPost = await Like.findOne({ postId: 1, userId: 1 });

      expect(createdPost).toBeTruthy();
    });
    it("should return add a new comment entry in the db if commentId is valid", async () => {
      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          commentId: 1,
        })
        .expect(200);

      const createdComment = await Like.findOne({ commentId: 1, userId: 1 });

      expect(createdComment).toBeTruthy();
    });
    it("should remove the like of the post when it is already liked", async () => {
      await Like.save(Like.create({ userId: 1, postId: 1 }));

      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          postId: 1,
        })
        .expect(200);

      const deletedLike = await Like.findOne({ postId: 1, userId: 1 });

      expect(deletedLike).toBeFalsy();
    });
    it("should remove the like of the comment when it is already liked", async () => {
      await Like.save(Like.create({ userId: 1, commentId: 1 }));

      await request(server)
        .post("/api/likes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          commentId: 1,
        })
        .expect(200);

      const deletedLike = await Like.findOne({ commentId: 1, userId: 1 });

      expect(deletedLike).toBeFalsy();
    });
  });
});
