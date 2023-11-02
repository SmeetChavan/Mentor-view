import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useApp } from '../context/appContext';
import { Button } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const Available = () => {

    const {mentor , setMentor , avaiStudents , setAvaiStudents , setFinal} = useApp();

    const handleAdd = async (studentId) => {

        if(mentor.students.length >= 4){
            toast.error("Maximum 4 students allowed");
            return;
        }

        try {

            toast.loading("Adding");

            await axios.post("http://localhost:4000/group/add" , {
                mentorId : mentor._id,
                studentId,
            });


            const updatedAvai = [...avaiStudents];
            const index = updatedAvai.findIndex((student) => student._id === studentId);

            const addedStudent = updatedAvai[index];

            updatedAvai.splice(index, 1);

            addedStudent.isAvailable = false;

            const updatedMentor = {...mentor};
            updatedMentor.students.push(addedStudent);

            setMentor(updatedMentor);
            setAvaiStudents(updatedAvai);

            localStorage.setItem("mentor" , JSON.stringify(updatedMentor));
            localStorage.setItem("available" , JSON.stringify(updatedAvai));

            console.log(updatedMentor);
            console.log(updatedAvai);

            setFinal(false);

            toast.dismiss();
            toast.success("Added to group");

        } catch (error) {
            toast.dismiss();
            toast.error("An error occured");
            console.log(error);
        }
    }

    const columns = [

        { field: 'id', headerName: 'ID', width: 130 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: "add",
            headerName: "Add Student",
            width: 150,
            renderCell: (params) => {
              const studentId = params.row._id;
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAdd(studentId)}
                >
                  Add
                </Button>
              );
            },
        },
    ];

    const rows = avaiStudents.map((student , index) => ({
        _id: student._id,
        id: index + 1,
        name: student.name,
        email: student.email
    }));

    return (
        <div style={{ height: "auto", width: '100%' }}>
            {
                avaiStudents.length === 0 ?

                <h2>No data</h2> :

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
            }
      </div>
    )
}

export default Available;