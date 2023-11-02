import express from "express";
import {
    addMentor,
    addStudent,
    addStudentToGroup,
    removeStudentFromGroup,
    getAllMentors,
    getStudentsFromEmail,
    getAllStudents,
    assignStudent
} from "../controllers/addRemove.js";

const router = express.Router();

router.get("/mentor/all" , getAllMentors);
router.get("/student/all" , getAllStudents);

router.post("/mentor/add" , addMentor);
router.post("/student/add" , addStudent);

router.post("/group/add" , addStudentToGroup);
router.post("/group/remove" , removeStudentFromGroup);

router.post("/mentor/find" , getStudentsFromEmail);

router.patch("/student/assign/:studentId" , assignStudent);

export default router;