import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import Slider from '@mui/material/Slider';
import axios from "axios";
import toast from "react-hot-toast";

import { useApp } from "../context/appContext";


const PopUpModal = ({ open, onClose, studentId }) => {

    const { mentor, setMentor, allStudents, setAllStudents } = useApp();

    const index = mentor.students
    ? mentor.students.findIndex((student) => student._id === studentId)
    : -1;

    let studentName = "";

    if (index !== -1) {
        studentName = mentor.students[index].name;
    }

    const [idea, setIdea] = useState(0);
    const [exec, setExec] = useState(0);
    const [viva, setViva] = useState(0);

    useEffect(() => {

        const func = () => {

            let initialMarks = { idea: 0, exec: 0, viva: 0 };

            if (index !== -1 && mentor.students[index].marks) {
                initialMarks = mentor.students[index].marks;
            }

            setIdea(initialMarks.idea);
            setExec(initialMarks.exec);
            setViva(initialMarks.viva);
        }

        func();

    }, [index])



    const handleSave = async () => {

        const total = idea + exec + viva;

        try {

            toast.loading("Saving..");

            const response = await axios.patch(`http://localhost:4000/student/assign/${studentId}` , {
                isMarksAssigned : true,
                marks : {
                    idea,
                    exec,
                    viva,
                    total
                },
            });

            toast.dismiss();
            toast.success("Saved");

            const updatedMentor = {...mentor};
            const updatedAllStudents = [...allStudents];


            const index1 = updatedMentor.students.findIndex((student) => student._id === studentId);
            updatedMentor.students[index1] = response.data;

            const index2 = updatedAllStudents.findIndex((student) => student._id === studentId);
            updatedAllStudents[index2] = response.data;

            console.log(updatedAllStudents);
            setMentor(updatedMentor);
            setAllStudents(updatedAllStudents);

            localStorage.setItem("mentor" , JSON.stringify(updatedMentor));
            localStorage.setItem("allStud" , JSON.stringify(updatedAllStudents));

            setIdea(0);
            setExec(0);
            setViva(0);
            onClose();

        } catch (error) {

            toast.dismiss();
            toast.error("An error occured");
            console.log("An error occured in PopUpModal Save");

        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth={true}>

            <DialogTitle className="evaluation_title">Evaluation for {studentName}</DialogTitle>
            <DialogContent>

                <div className="ideation">
                    <p>Ideation:</p>
                    <Slider
                        value={idea}
                        onChange={(_, newValue) => setIdea(newValue)}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={10}
                    />
                </div>
                <div>
                    <p>Execution:</p>
                    <Slider
                        value={exec}
                        onChange={(_, newValue) => setExec(newValue)}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={10}
                    />
                </div>
                <div>
                    <p>Viva:</p>
                    <Slider
                        value={viva}
                        onChange={(_, newValue) => setViva(newValue)}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={10}
                    />
                </div>
                <div className="total_marks">Total Marks : {idea + exec + viva}</div>

            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="contained" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default PopUpModal;
