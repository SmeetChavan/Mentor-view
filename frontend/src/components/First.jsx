import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { useApp } from '../context/appContext';
import { DataGrid } from '@mui/x-data-grid';

const First = () => {

    const { mentor, setMentor } = useApp();
    const [email , setEmail] = useState("");

    const [allMentors , setAllMentors] = useState([]);

    useEffect(() => {
        
        const func = async () => {
        
            try {

                const response = await axios.get("http://localhost:4000/mentor/all");
                setAllMentors(response.data);

            } catch (error) {
                console.log(error);
            }
        }

        func();
    }, [])


    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!email){
            toast.error("Empty field");
            return;
        }

        try {

            const response = await axios.post("http://localhost:4000/mentor/find", {
                email,
            });

            if(response.status === 204) {
                toast.error("Email not found in the database");
                return;
            }

            setMentor(response.data);
            console.log(response.data);
            localStorage.setItem("mentor" , JSON.stringify(response.data));
            navigate("/dash/mygroup");

        } catch (error) {
            console.log(error);
        }
    }


    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
    ];

    const rows = (allMentors !== null) ? allMentors.map((mentor) => ({
        id: mentor._id,
        name: mentor.name,
        email: mentor.email
    })) : [];


    return (

        <div className='first'>

            <form className='firstForm' onSubmit={(e) => handleSubmit(e)}>

                <h1>
                    Enter your email
                </h1>

                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="submit" value="Submit" />

            </form>

            <div style={{ height: "auto", width: 'fit-content', color: "white" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                    style={{color: "white"}}
                />
            </div>


        </div>

    )
}

export default First;