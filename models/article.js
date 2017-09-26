import mongoose, { Schema, SchemaTypes as Types } from 'mongoose';

const articleSchema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: Types.String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    description: {
        type: Types.String,
        required: true,
        minlength: 6,
        maxlength: 60,
    }
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
