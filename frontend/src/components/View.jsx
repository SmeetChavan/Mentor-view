import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useApp } from '../context/appContext';
import { Button , Chip } from '@mui/material';

const View = () => {

	const {allStudents , setAllStudents , mentor , setMentor , avaiStudents , setAvaiStudents} = useApp();

    const [filter , setFilter] = useState(0);

    const handleAssign = () => {

        if(filter !== 1){
            setFilter(1);
        }
        else{
            setFilter(0);
        }
    }

    const handleNotAssign = () => {

        if(filter !== 2){
            setFilter(2);
        }
        else{
            setFilter(0);
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
                const index = allStudents.findIndex((student) => student._id === studentId);

                let isAssigned = false;

                if(index !== -1){
                    isAssigned = (allStudents[index].isMarksAssigned);
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
        { field: 'marks', headerName: 'Marks', width: 200 },
    ];

    const all = allStudents.map((student , index) => ({
        _id: student._id,
        id: index + 1,
        name: student.name,
        email: student.email,
        isMarksAssigned: student.isMarksAssigned,
        marks: student.marks.total,
    }));

    const assigned = all.filter((student) => student.isMarksAssigned === true);
    const notAssigned = all.filter((student) => student.isMarksAssigned === false);

	return (
        <>

            <div className='filters'>
                <Button variant="contained" onClick={() => handleAssign()}>Filter by assigned</Button>
                <Button variant="contained" onClick={() => handleNotAssign()}>Filter by not assigned</Button>
            </div>

            <div style={{ height: "auto", width: '100%' }}>
                {
                    allStudents.length === 0 ?

                    <h2>No data</h2> :

                    <DataGrid
                        rows={(filter == 0) ? all : (filter == 1) ? assigned : notAssigned}
                        columns={columns}
                        initialState={{
                            pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        className='data_grid'
                    />
                }
            </div>
        </>

	)
}

export default View;