import mongoose from "mongoose";

const Schema = mongoose.Schema;

const studentSchema = new Schema({

    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isMarksAssigned: {
        type: Boolean,
        default: false,
    },
    marks: {
        idea: {
            type: Number,
            default: 0,
        },
        exec: {
            type: Number,
            default: 0,
        },
        viva: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        }
    }

} , {timestamps: true});

export const Student = mongoose.model('Student' , studentSchema);