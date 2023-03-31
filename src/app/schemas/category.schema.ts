import { gql } from "apollo-server-express";
import Category from "../models/category.model";

/**
 * Make query
 */

export const typeDefs = gql`
    type Category {
        id: ID
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
    }

    type Query {
        category(_id: ID!): Category
        categories: [Category]
        searchCategory: Category
    }

    input CategoryInput {
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
    }

    type Mutation {
        createCategory(post: CategoryInput): Category
        updateCategory(id: String, post: CategoryInput): Category
        deleteCategory(id: String): String
        buikStatusChange(category: String, isActive: Boolean): [Category]
    }
`;

export const resolvers = {
    Query: {
        category: async (parent: any, args: any, context: any, info: any) => {
            return Category.findOne({ _id: args._id });
        },

        categories: async () => {
            return await Category.find();
        },

        searchCategory: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const regex = new RegExp(`^${args.category}$`, "i");
            const data: any = Category.findOne({ category: regex });
            const parentCategoryName = data.parentCategory.split("/");
            const parentCategory = Category.findOne({
                parentCategory:
                    parentCategoryName[parentCategoryName.length - 1],
            });

            return { ...data, parentCategory };
        },
    },
    Mutation: {
        createCategory: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { name, category, parentCategory, isActive } = args.post;
            const post = await new Category({
                name,
                category,
                parentCategory,
                isActive,
            }).save();
            return post;
        },

        updateCategory: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { id } = args;
            const { name, category, parentCategory, isActive } = args.update;
            const update = await Category.findByIdAndUpdate(
                id,
                { name, category, parentCategory, isActive },
                { new: true }
            );
            return update;
        },

        buikStatusChange: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { category, isActive } = args.update;
            const regex = new RegExp(category.replace("/", "\\/"), "i");

            const filter = {
                category: regex,
                parentCategory: { $regex: regex, $options: "i" },
            };

            const update = { $set: { isActive } };
            const data = await Category.updateMany(filter, update).lean();
            return data;
        },

        deleteCategory: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { id } = args;
            await Category.findByIdAndDelete(id);
            return "Deleted";
        },
    },
};
