
import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefault";
import { followHelper } from "../utils/utils";
import { useCurrentUser } from './CurrentUserContext';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext)
export const useSetProfileData = () => useContext(SetProfileDataContext)



export const ProfileDataProvider = ({ children }) => {

    const currentUser = useCurrentUser();

    const handleFollow = async (clickedProfile, follow) => {
        try {
            const { data } = follow ?
                await axiosRes.post('/followers/', { followed: clickedProfile.id })
                : await axiosRes.delete(`/followers/${clickedProfile.following_id}/`)
            setProfileData(prevState => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map(profile => followHelper(profile, clickedProfile, data.id, follow))
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map(profile => followHelper(profile, clickedProfile, data.id, follow))
                }
            }))

        } catch (err) {
            console.log(err)
        }
    }

    const [profileData, setProfileData] = useState({
        pageProfile: { results: [] },
        popularProfiles: { results: [] },
    });


    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(
                    "/profiles/?ordering=-followers_count"
                );
                setProfileData(prevState => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch (err) {
                console.log(err)
            }
        };
        handleMount()
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={{ setProfileData, handleFollow }}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
};