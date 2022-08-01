import { axiosReq } from "../api/axiosDefault"

export const fetchMoreData = async (resource, setResource) => {
    try {
        const { data } = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next: data.next,
            results: data.results.reduce((acc, cur) => {
                return acc.some((accResult) => accResult.id === cur.id)
                ? acc: [...acc, cur];
             }, prevResource.results),
        }));
    } catch (err) {}
};

export const followHelper = (profile, clickedProfile, following_id, follow) =>
{console.log(follow);
    return profile.id === clickedProfile.id ?
        {
            ...profile,
            followers_count: profile.followers_count + (follow ? 1 : -1), 
            following_id: follow ? following_id  : null
        }
        : profile.is_owner ?
            {...profile, following_count: profile.following_count + (follow ? 1 : -1)}
            :
            profile;
}