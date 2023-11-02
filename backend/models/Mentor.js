import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mentorSchema = new Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },

    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],

} , {timestamps: true});

export const Mentor = mongoose.model('Mentor' , mentorSchema);