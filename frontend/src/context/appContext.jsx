import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

    const [mentor, setMentor] = useState({ name: '' , email : '' , students: [] });
    const [avaiStudents, setAvaiStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [final, setFinal] = useState(false);

    useEffect(() => {

        const initialMentor = () => {

            const data = localStorage.getItem("mentor");

            if(data){

                const parsed = JSON.parse(data);

                setMentor({
                    name: parsed.name,
                    email: parsed.email,
                    students: parsed.students
                })
            }
        }

        const initialAvaiStud = () => {

            const data = localStorage.getItem("available");

            if(data){

                const parsed = JSON.parse(data);
                setAvaiStudents(parsed)
            }
        }

        const initialAllStud = () => {

            const data = localStorage.getItem("allStud");

            if(data){

                const parsed = JSON.parse(data);
                setAllStudents(parsed)
            }
        }

        initialMentor();
        initialAvaiStud();
        initialAllStud();
    }, [])


    return (
        <AppContext.Provider value={{ mentor, setMentor, avaiStudents, setAvaiStudents , allStudents , setAllStudents , final , setFinal}}>
        {children}
        </AppContext.Provider>
    );
};