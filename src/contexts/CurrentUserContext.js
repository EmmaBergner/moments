import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefault";
import { useNavigate } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    const handleMount = async () => {
        try {
            let user = await axios.get('dj-rest-auth/user/')
            if (user) {
                const { data } = user
                setCurrentUser(data)
            }
            else { setCurrentUser(null) }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    //////////////////// Interceptors /////////////////// 

    const navigate = useNavigate();


    // axiosReq.interceptors.request.use(
    //         async (config) => {
    //             console.log("req0")
    //             try {
    //                 console.log("req1")
    //                 await axios.post("/dj-rest-auth/token/refresh/");
    //                 console.log("req2")
    //             } catch (err) {
    //                 console.log("req3")
    //                 setCurrentUser((prevCurrentUser) => {
    //                     if (prevCurrentUser) {
    //                         console.log("req4")
    //                         navigate("/signin");
    //                     }
    //                     console.log("req5")
    //                     return null;
    //                 });
    //                 return config;
    //             }
    //             return config;
    //         },
    //         (err) => {
    //             console.log("req6")
    //             return Promise.reject(err);
    //         }
    //     );

    //     axios.interceptors.response.use(
    //         (response) => response,
    //         async (err) => {
    //             console.log("res")}
    //     );



    useMemo(() => {
        axiosReq.interceptors.request.use(
            async (config) => {
                console.log("req0");
                try {console.log("req1")
                    await axios.post("/dj-rest-auth/token/refresh/");
                    console.log("req2")
                } catch (err) {
                    setCurrentUser((prevCurrentUser) => {
                        if (prevCurrentUser) {
                            navigate("/signin");
                        }
                        return null;
                    });
                    return config;
                }
                return config;
            },
            (err) => {
                return Promise.reject(err);
            }
        );

        axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401) {
                    try {
                        await axios.post("/dj-rest-auth/token/refresh/");
                    } catch (err) {
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                navigate("/signin");
                            }
                            return null;
                        });
                    }
                    return axios(err.config);
                }
                return Promise.reject(err);
            }
        );
    }, [navigate]);

    ///////////// End interceptors ///////////////////

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};