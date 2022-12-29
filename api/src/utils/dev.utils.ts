import { hash } from "argon2";
import { Connection } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Friendship } from "../entities/friendship.entity";
import { Like } from "../entities/like.entity";
import { Photo } from "../entities/photo.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";

function generateStr(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const seedDatabase = async (connection: Connection) => {
  await connection.dropDatabase();
  await connection.synchronize();

  const userRepo = connection.getRepository(User);
  const likeRepo = connection.getRepository(Like);
  const commentRepo = connection.getRepository(Comment);

  const photo1 = Photo.create({
    key: "c9ad10e9-25c5-40c7-af52-ad25c961ee5c",
    fileName: "c9ad10e9-25c5-40c7-af52-ad25c961ee5c.jpg",
    extension: ".jpg",
  });

  await photo1.save();

  const photo2 = Photo.create({
    key: "e56461c2-8532-42d3-95ee-5c7969550c71",
    fileName: "e56461c2-8532-42d3-95ee-5c7969550c71.jpg",
    extension: ".jpg",
  });

  await photo2.save();

  const testUser = userRepo.create({
    username: "ljparfan",
    email: "ljparfan22@gmail.com",
    name: "LJ",
    password: await hash("qweqwe1"),
    profilePhotoId: photo1.id,
  });

  const testUser1 = userRepo.create({
    username: "ljparfan1",
    email: "ljparfan23@gmail.com",
    name: "LJ",
    password: await hash("qweqwe1"),
    profilePhotoId: photo2.id,
  });

  const testUser2 = userRepo.create({
    username: "jsace",
    email: "jazminesace@gmail.com",
    name: "Jazmine Sace",
    password: await hash("qweqwe1"),
  });

  await userRepo.save([testUser, testUser1, testUser2]);

  const postRepo = connection.getRepository(Post);

  const usersPromise = [...Array(100).keys()].map((_item) => {
    return new Promise(async (resolve) => {
      const str = generateStr(10);
      resolve(
        userRepo.create({
          username: str,
          email: `${str}@gmail.com`,
          name: str,
          password: await hash("qweqwe1"),
        })
      );
    });
  });

  await userRepo.save((await Promise.all(usersPromise)) as User[]);

  const friendships = [...Array(100).keys()]
    .map(
      (_item, index) =>
        ({
          requesteeId: 3,
          requestorId: index + 1,
          status: FriendshipStatus.PENDING,
        } as Friendship)
    )
    .filter(({ requestorId }) => requestorId !== 3);

  await Friendship.save(friendships);

  const posts = [...Array(20).keys()].map((_item, index) =>
    postRepo.create({
      value: `Test value ${index}`,
      userId: index % 2 ? testUser.id : testUser1.id,
    })
  );

  await Post.save(posts);

  photo1.postId = 1;
  photo2.postId = 2;

  await Photo.save([photo1, photo2]);

  const like = likeRepo.create({
    post: {
      id: 1,
    },
    user: {
      id: 1,
    },
  });

  const like2 = likeRepo.create({
    post: {
      id: 1,
    },
    user: {
      id: 2,
    },
  });

  await likeRepo.save([like, like2]);

  const comment = commentRepo.create({
    post: {
      id: 1,
    },
    user: {
      id: 1,
    },
    value: "Comment",
  });

  const comment2 = commentRepo.create({
    post: {
      id: 1,
    },
    user: {
      id: 2,
    },
    value: "Comment 2",
  });

  await commentRepo.save([comment, comment2]);
  // for (const post of posts) {
  //   setTimeout(async () => {
  //     await postRepo.save(post);
  //   }, 2_000);
  // }
};
