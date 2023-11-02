import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useApp } from '../context/appContext';
import { Button, Chip } from '@mui/material';

import axios from 'axios';
import {toast} from 'react-hot-toast';
import PopUpModal from './PopUpModal';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const MyGroup = () => {

    const {mentor , setMentor , avaiStudents , setAvaiStudents , final , setFinal} = useApp();

    const [open , setOpen] = useState(false);
    const [selectedId , setSelectedId] = useState(null);

    const handleOpenModal = (studentId) => {
        setSelectedId(studentId);
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleFinalSubmit = () => {

        if(!mentor.students.every((student) => student.isMarksAssigned)){
            toast.error('Assign every student');
            return;
        }

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const documentDefinition = {
          content: [
            { text: 'Student Marks Report', style: 'header' },
            { text: 'Generated on: ' + new Date().toLocaleString() },
            { text: ' ', margin: [0, 10] },
            ...mentor.students.map((student) => ({
              text: student.name + ': ' + student.marks.total,
              style: 'studentInfo',
            })),
          ],
          styles: {
            header: { fontSize: 18, bold: true },
            studentInfo: { fontSize: 14, margin: [0, 5] },
          },
        };


        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.download('student_marks_report.pdf');

        setFinal(true);
        console.log(mentor.students);
    }

    const handleRemove = async(studentId) => {

        if(mentor.students.length <= 3){
            toast.error("Minimum 3 students should present");
            return;
        }

        try {

            toast.loading("Removing");

            const response = await axios.post("http://localhost:4000/group/remove" , {
                mentorId : mentor._id,
                studentId,
            });

            if(response.status === 204){
                toast.error("Student not found");
                return;
            }
            if(response.status === 205){
                toast.error("Mentor not found");
                return;
            }
            if(response.status === 206){
                toast.error("Student not found in mentor's group");
                return;
            }

            await axios.patch(`http://localhost:4000/student/assign/${studentId}` , {
                isMarksAssigned: false,
                marks: {
                    idea: 0,
                    exec : 0,
                    viva : 0,
                    total : 0
                },
            });

            const copyMentor = { ...mentor };
            const index = copyMentor.students.findIndex((student) => student._id === studentId);

            const removedStudent = copyMentor.students[index];

            copyMentor.students.splice(index, 1);

            removedStudent.isAvailable = true;
            removedStudent.isMarksAssigned = false;
            removedStudent.marks.idea = 0;
            removedStudent.marks.exec = 0;
            removedStudent.marks.viva = 0;
            removedStudent.marks.total = 0;

            setAvaiStudents((prev) => [...prev, removedStudent]);
            setMentor(copyMentor);

            localStorage.setItem("mentor" , JSON.stringify(copyMentor));
            localStorage.setItem("available" , JSON.stringify(avaiStudents));

            toast.dismiss();
            toast.success("Removed from group");

        } catch (error) {

            toast.dismiss();
            toast.error("An error occured");
            console.log("An error occured in MyGroup component");

        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 130 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: "status",
            headerName: "Status",
            width: 150,

            renderCell: (params) => {

                const studentId = params.row._id;
                const index = mentor.students.findIndex((student) => student._id === studentId);

                let isAssigned = false;

                if(index !== -1){
                    isAssigned = (mentor.students[index].isMarksAssigned);
                }


                const chipStyle = {
                    backgroundColor: isAssigned ? '#46c046' : '#A5A5A5',
                };

                return (
                <Chip
                    label= {(isAssigned) ? "Assigned" : "Not Assigned"}
                    color="primary"
                    style={chipStyle}
                />
                );
            },
          },
        {
            field: "eval",
            headerName: "Evaluate",
            width: 150,
            renderCell: (params) => {
              const studentId = params.row._id;
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(studentId)}
                  disabled={final}
                >
                  Evaluate
                </Button>
              );
            },
        },
        {
            field: "remove",
            headerName: "Remove",
            width: 150,
            renderCell: (params) => {
              const studentId = params.row._id;
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemove(studentId)}
                >
                  Remove
                </Button>
              );
            },
        },
    ];

    const rows = (mentor.students) ? mentor.students.map((student , index) => ({
        _id: student._id,
        id: index + 1,
        name: student.name,
        email: student.email
    })) : [];

    return (
        <div style={{ height: 'auto', width: '100%' }}>

            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10]}
            />
            <PopUpModal
                open={open}
                onClose={handleCloseModal}
                studentId={selectedId}
            />

            <Button variant="contained" onClick={() => handleFinalSubmit()}>
                Final Submit
            </Button>
        </div>
    )
}

export default MyGroup;