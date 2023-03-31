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
