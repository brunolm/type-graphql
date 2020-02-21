import { promises as fs } from "fs";
import directoryTree from "directory-tree";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { stringifyDirectoryTrees } from "../helpers/structure";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("structure", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-structure");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should generate proper folders structure and file names for complex datamodel", async () => {
    const schema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }

      model User {
        id     Int      @id @default(autoincrement())
        name   String?
        posts  Post[]
      }

      model Post {
        uuid      String  @id @default(cuid())
        content   String
        author    User
        color     Color
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const directoryStructure = directoryTree(outputDirPath);
    const directoryStructureString =
      "\n[type-graphql]\n" +
      stringifyDirectoryTrees(directoryStructure.children, 2);

    expect(directoryStructureString).toMatchInlineSnapshot(`
      "
      [type-graphql]
        [enums]
          Color.ts
          OrderByArg.ts
          index.ts
        index.ts
        [models]
          Post.ts
          User.ts
          index.ts
        [resolvers]
          [crud]
            [Post]
              CreateOnePostResolver.ts
              DeleteManyPostResolver.ts
              DeleteOnePostResolver.ts
              FindManyPostResolver.ts
              FindOnePostResolver.ts
              PostCrudResolver.ts
              UpdateManyPostResolver.ts
              UpdateOnePostResolver.ts
              UpsertOnePostResolver.ts
              [args]
                CreateOnePostArgs.ts
                DeleteManyPostArgs.ts
                DeleteOnePostArgs.ts
                FindManyPostArgs.ts
                FindOnePostArgs.ts
                UpdateManyPostArgs.ts
                UpdateOnePostArgs.ts
                UpsertOnePostArgs.ts
                index.ts
            [User]
              CreateOneUserResolver.ts
              DeleteManyUserResolver.ts
              DeleteOneUserResolver.ts
              FindManyUserResolver.ts
              FindOneUserResolver.ts
              UpdateManyUserResolver.ts
              UpdateOneUserResolver.ts
              UpsertOneUserResolver.ts
              UserCrudResolver.ts
              [args]
                CreateOneUserArgs.ts
                DeleteManyUserArgs.ts
                DeleteOneUserArgs.ts
                FindManyUserArgs.ts
                FindOneUserArgs.ts
                UpdateManyUserArgs.ts
                UpdateOneUserArgs.ts
                UpsertOneUserArgs.ts
                index.ts
            index.ts
          [inputs]
            ColorFilter.ts
            IntFilter.ts
            NullableStringFilter.ts
            PostCreateInput.ts
            PostCreateManyWithoutAuthorInput.ts
            PostCreateWithoutAuthorInput.ts
            PostFilter.ts
            PostOrderByInput.ts
            PostScalarWhereInput.ts
            PostUpdateInput.ts
            PostUpdateManyDataInput.ts
            PostUpdateManyMutationInput.ts
            PostUpdateManyWithWhereNestedInput.ts
            PostUpdateManyWithoutAuthorInput.ts
            PostUpdateWithWhereUniqueWithoutAuthorInput.ts
            PostUpdateWithoutAuthorDataInput.ts
            PostUpsertWithWhereUniqueWithoutAuthorInput.ts
            PostWhereInput.ts
            PostWhereUniqueInput.ts
            StringFilter.ts
            UserCreateInput.ts
            UserCreateOneWithoutPostsInput.ts
            UserCreateWithoutPostsInput.ts
            UserOrderByInput.ts
            UserUpdateInput.ts
            UserUpdateManyMutationInput.ts
            UserUpdateOneRequiredWithoutPostsInput.ts
            UserUpdateWithoutPostsDataInput.ts
            UserUpsertWithoutPostsInput.ts
            UserWhereInput.ts
            UserWhereUniqueInput.ts
            index.ts
          [outputs]
            AggregatePost.ts
            AggregateUser.ts
            BatchPayload.ts
            index.ts
          [relations]
            [Post]
              PostRelationsResolver.ts
            [User]
              UserRelationsResolver.ts
              [args]
                UserPostsArgs.ts
                index.ts
            index.ts
      "
    `);
  });
});
