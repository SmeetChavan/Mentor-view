import axios from 'axios';
import React, { useEffect } from 'react';
import { useApp } from '../context/appContext';
import { useLocation, useNavigate } from 'react-router-dom';

import MyGroup from './MyGroup';
import Available from './Available';
import View from './View';

import { AccountCircle, Group, School } from '@mui/icons-material';

const Dashboard = () => {

    const { mentor, setMentor, allStudents , setAllStudents , avaiStudents, setAvaiStudents} = useApp();
    if(!mentor._id){
        const data = localStorage.getItem("mentor");
        const parsed = JSON.parse(data);
        setMentor(parsed);
    }
    if(!allStudents){
        const data = localStorage.getItem("allStud");
        const parsed = JSON.parse(data);
        setAllStudents(parsed);
    }
    if(!avaiStudents){
        const data = localStorage.getItem("available");
        const parsed = JSON.parse(data);
        setAvaiStudents(parsed);
    }

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const response = await axios.get("http://localhost:4000/student/all");

                setAllStudents(response.data);
                localStorage.setItem("allStud" , JSON.stringify(response.data));
                console.log(response.data);

                const onlyAvai = response.data.filter((student) => student.isAvailable === true);

                setAvaiStudents(onlyAvai);
                localStorage.setItem("available" , JSON.stringify(onlyAvai));
                console.log(response.data);

            } catch (error) {
                toast.error("An error occured in Dashboard useEffect");
            }
        };

        fetchData();
    }, [mentor]);


    return (
        <>
            <div className='dash'>

                <div className="sidebar">

                    <h3>Mentor View</h3>

                    <div className={`sidebar-item ${location.pathname.includes("mygroup") ? "selected_item" : ""}`} onClick={() => navigate('/dash/mygroup')}>
                        <div>
                            <Group className="icon" />
                            <div>Your group</div>
                        </div>
                    </div>
                    <div className={`sidebar-item ${location.pathname.includes("available") ? "selected_item" : ""}`} onClick={() => navigate('/dash/available')}>
                        <div>
                            <AccountCircle className="icon" />
                            <div>Available students</div>
                        </div>
                    </div>

                    <div className={`sidebar-item ${location.pathname.includes("view") ? "selected_item" : ""}`} onClick={() => navigate('/dash/view')}>
                        <div>
                            <School className="icon" />
                            <div>View Tab</div>
                        </div>
                    </div>

                </div>

                <div className='right'>

                    <h4 className="header"> Hello {mentor.name} </h4>

                    <div className="content">

                        {location.pathname.includes("mygroup") ? <MyGroup/> : 

                            location.pathname.includes("available") ? <Available/> : 

                            <View/>
                        }

                    </div>

                </div>

            </div>
        </>
    )
}

export default Dashboard;