import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    pages: {
        type: String,
        required: true
    }
});

const pageModel = mongoose.model("page", pageSchema);

export { pageModel };