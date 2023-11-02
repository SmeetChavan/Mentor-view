import mongoose from "mongoose";
import { Mentor } from "../models/Mentor.js";
import { Student } from "../models/Student.js";

export const addMentor = async (req , res , next) => {

    const {name , email} = req.body;

    try {

        const mentor = await Mentor.create({
            name,
            email
        });

        res.status(200).json(mentor);

    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const addStudent = async (req , res , next) => {

    const {name , email} = req.body;

    try {

        const student = await Student.create({
            name,
            email,
        });

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const addStudentToGroup = async (req , res , next) => {

    const {studentId , mentorId} = req.body;

    try {

        const mentor = await Mentor.findById(mentorId);
        if(!mentor) {
            return res.status(204).json({ error: "Mentor not found" });
        }

        const student = await Student.findById(studentId);
        if(!student) {
            return res.status(205).json({ error: "Student not found" });
        }

        mentor.students.push(studentId);
        await mentor.save();

        student.isAvailable = false;
        await student.save();

        res.status(200).json({student});
    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const removeStudentFromGroup = async (req , res , next) => {

    const {studentId , mentorId} = req.body;

    if(!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: "Invalid student Id" });
    }

    if(!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ error: "Invalid mentor Id" });
    }

    try {

        const mentor = await Mentor.findById(mentorId);
        if(!mentor) {
            return res.status(204).json({ error: "Mentor not found" });
        }

        const student = await Student.findById(studentId);
        if(!student) {
            return res.status(205).json({ error: "Student not found" });
        }

        const studentIndex = mentor.students.findIndex(id => id.toString() === studentId);

        if(studentIndex === -1) {
            return res.status(206).json({ error: "Student not found in mentor's group" });
        }

        mentor.students.splice(studentIndex, 1);
        await mentor.save();

        student.isAvailable = true;
        student.isMarksAssigned = false;
        student.marks.idea = 0;
        student.marks.exec = 0;
        student.marks.viva = 0;
        student.marks.total = 0;
        await student.save();

        res.status(200).json(mentor);
    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const getAllMentors = async (req , res , next) => {

    try {

        const mentors = await Mentor.find({});

        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const getAllStudents = async (req , res , next) => {

    try {

        const students = await Student.find({});

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const getStudentsFromEmail = async (req , res , next) => {

    const {email} = req.body;

    try {

        const mentor = await Mentor.findOne({ email: email }).populate('students');

        if(!mentor){
            return res.status(204).json({message : "Mentor not found"});
        }

        res.status(200).json(mentor);

    } catch (error) {
        res.status(500).json({error : "Some error occured"});
    }
}

export const assignStudent = async (req, res, next) => {

    const { studentId } = req.params;
    const { isMarksAssigned , marks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: "Invalid student Id" });
    }

    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { $set: { isMarksAssigned , marks } },
            { new: true }
        );

        if (!student) {
            return res.status(204).json({ error: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: "Some error occurred" });
    }
}