import { getSession } from "@auth0/nextjs-auth0";

export default async function User(req, res) {
        console.log("/api/user " + req.method);
        if (req.method == 'POST') {
            try {
                const data = req.body;
                
                // Retrieve an access token to allow us to call the Auth0 Management API /api/v2/users endpoint.
                // TODO: Why do I have to fetch a new access token? Why can't auth0-nextjs get a secure AT instead of a SPA AT? This endpoint has rate limits for M2M tokens.
                const token = await fetch('https://tylernix-dev.us.auth0.com/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        grant_type: 'client_credentials',
                        client_id: process.env.AUTH0_CLIENT_ID,
                        client_secret: process.env.AUTH0_CLIENT_SECRET,
                        audience: 'https://tylernix-dev.us.auth0.com/api/v2/'
                    })
                })
                const { access_token } = await token.json();

                // Get current user's sub id and update user profile in Auth0 with new edited values
                const { user } = await getSession(req, res);
                const updateResponse = await fetch(`https://tylernix-dev.us.auth0.com/api/v2/users/${user.sub}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(data)
                })
                const updatedUser = await updateResponse.json();
                // TODO: Need to write some error logic if Auth0 call fails (like when an email address already exists)

                // Return updated user
                return res.status(200).json(updatedUser);
            } catch (error) {
                console.error(error);
            }
        } else {
            return res.status(405).json({msg: "Method not implemented."})
        }
    
    
    
}