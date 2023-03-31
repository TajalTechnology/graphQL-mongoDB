import { gql } from "apollo-server-express";
import Category from "../models/category.model";

/**
 * Make query
 */

export const typeDefs = gql`
    type Category {
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
    }

    type SearchCategory {
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
        parent: Category
    }

    type Query {
        category(_id: ID!): Category
        categories: [Category]
        searchCategory(category: String): SearchCategory
    }

    input CategoryInput {
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
    }

    input BulkInput {
        name: String
        category: String
        parentCategory: String
        isActive: Boolean
    }

    type Mutation {
        createCategory(post: CategoryInput): Category
        updateCategory(id: String, post: CategoryInput): Category
        deleteCategory(id: String): String
        buikStatusChange(bulkChange: BulkInput): [Category]
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
            let data: any = await Category.findOne({
                category: new RegExp(`^${args.category}$`, "i"),
            });

            const parentCategoryName = data.parentCategory.split("/");
            const parentCategory = await Category.findOne({
                category: parentCategoryName[parentCategoryName.length - 1],
            });

            if (!parentCategory) return { ...data._doc, parent: data._doc };
            return { ...data._doc, parent: parentCategory };
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
            const { category, isActive } = args.bulkChange;
            const regex = new RegExp(category.replace("/", "\\/"), "i");

            const filter = {
                $or: [
                    { category: category },
                    { parentCategory: { $regex: category, $options: "i" } },
                ],
            };

            if (isActive) {
                const update = { $set: { isActive } };
                const bulkChange = await Category.updateMany(
                    filter,
                    update
                ).lean();
            }
            return "Secsessfully Executed";
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
