// import {
//     GraphQLObjectType,
//     GraphQLID,
//     GraphQLString,
//     GraphQLSchema,
//     GraphQLList,
//     GraphQLNonNull,
//     GraphQLBoolean,
// } from "graphql";

// const CategoryType = new GraphQLObjectType({
//     name: "Category",
//     fields: () => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         category: { type: GraphQLString },
//         parentCategory: { type: GraphQLString },
//         isActive: { type: GraphQLBoolean },
//     }),
// });

// const RootQuery = new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {
//         categories: {
//             type: new GraphQLList(CategoryType),
//             resolve(parent, args) {
//                 return Category.find();
//             },
//         },
//         category: {
//             type: CategoryType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return Category.findById(args.id);
//             },
//         },
//     },
// });

// // Mutations
// const mutation = new GraphQLObjectType({
//     name: "Mutation",
//     fields: {
//         /**
//          * Add a category
//          */
//         addClient: {
//             type: CategoryType,
//             args: {
//                 name: { type: new GraphQLNonNull(GraphQLString) },
//                 category: { type: new GraphQLNonNull(GraphQLString) },
//                 parentCategory: { type: new GraphQLNonNull(GraphQLString) },
//                 isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
//             },
//             resolve(parent, args) {
//                 const category = new Category({
//                     name: args.name,
//                     category: args.category,
//                     parentCategory: args.parentCategory,
//                     isActive: args.isActive,
//                 });

//                 return category.save();
//             },
//         },
//         /**
//          * Delete a project
//          */
//         deleteProject: {
//             type: CategoryType,
//             args: {
//                 id: { type: new GraphQLNonNull(GraphQLID) },
//             },
//             resolve(parent, args) {
//                 return Category.findByIdAndRemove(args.id);
//             },
//         },

//         /**
//          * Update
//          */
//         updateProject: {
//             type: CategoryType,
//             args: {
//                 name: { type: new GraphQLNonNull(GraphQLString) },
//                 category: { type: new GraphQLNonNull(GraphQLString) },
//                 parentCategory: { type: new GraphQLNonNull(GraphQLString) },
//                 isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
//             },
//             resolve(parent, args) {
//                 return Category.findByIdAndUpdate(
//                     args.id,
//                     {
//                         $set: {
//                             name: args.name,
//                             category: args.category,
//                             parentCategory: args.parentCategory,
//                             isActive: args.isActive,
//                         },
//                     },
//                     { new: true }
//                 );
//             },
//         },
//     },
// });

// module.exports = new GraphQLSchema({
//     query: RootQuery,
//     mutation,
// });
