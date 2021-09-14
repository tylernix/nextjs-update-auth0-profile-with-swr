import useSWR from "swr";
import { useCallback, useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (url) =>
  fetch(url)
    .then((r) => {return r.json()})



export function useProfile({user} = {}) {
    const [profile, setProfile] = useState(undefined)

    // We need to disable revalidateIfStale because it quickly updates the profile on new page mount from /api/auth/me (old data) before it has time to update the user in the Auth0 Management API.
    const { data, error, mutate } = useSWR('/api/auth/me', fetcher, {revalidateIfStale: false}); 
    const { checkSession } = useUser();

    useEffect(() => {
        console.log("setting profile");
        console.log(data);
        setProfile(!data?.error ? data : undefined);
    }, [data]);

    const updateProfile = useCallback(async (user) => {
        // Send a request to update the user's profile in Auth0
        const u = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                email: user.email,
                email_verified: user.email_verified,
                nickname: user.nickname,
                picture: user.picture
            })
        }).then(res => res.json());
        //console.log(u);

        // Execute a refetch of the Auth0 profile to be cached & update the cookie
        // These two lines are very important for nextjs-auth0 to update the user session
        // It is equally important that they are called from the frontend or else the auth0 cookie will not update properly
        await fetch('/api/auth/refetch'); 
        await checkSession();             
        
        // Trigger a revalidation (refetch) to make sure our local data at /api/auth/me is correct and up-to-date
        mutate();
    }, [user]);

    return { profile, isLoading: !error && !data, isError: error && data.error, mutate, updateProfile};
}