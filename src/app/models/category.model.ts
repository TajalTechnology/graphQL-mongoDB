import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
    name: String;
    category: String;
    parentCategory: String;
    isActive: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, require: true },
        category: { type: String },
        parentCategory: { type: String, default: "/" },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        strict: true,
    }
);
// Create an index on category and parentCategory fields
CategorySchema.index({ category: "text", parentCategory: "text" });

const CategoryModel = mongoose.model<CategoryDocument>(
    "Category",
    CategorySchema
);
export default CategoryModel;
