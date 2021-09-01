import useSWR from "swr";
import { useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0";

const fetcher = (url) =>
  fetch(url)
    .then((r) => {return r.json()})

export function useProfile({user} = {}) {
    const { checkSession } = useUser();
    const { data, error, mutate } = useSWR('/api/auth/me', fetcher, {refreshInterval: 10}); // We need a relatively quick refreshInterval to make changing the pages seamless.

    const updateProfile = useCallback(async (user) => {
        // Update the local data at /api/auth/me immediately, but disable the useSWR revalidation
        mutate({...user}, false);

        // Send a request to the API to update the user's profile in Auth0
        const response = await fetch('/api/user', {
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
        });
        const u = await response.json();

        // Execute a refetch of the Auth0 profile to be cached & update the cookie
        // These two lines are very important for nextjs-auth0 to update the user session
        // It is equally important that they are called from the frontend or else the cookie will not update properly
        await fetch('/api/auth/refetch'); 
        await checkSession();             
        
        // Trigger a revalidation (refetch) to make sure our local data at /api/auth/me is correct
        mutate();
    }, [user]);

    return { profile: data, isLoading: !error && !data, isError: error, mutate, updateProfile};
}