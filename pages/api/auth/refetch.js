import { handleProfile } from '@auth0/nextjs-auth0';

export default async function refetch(req, res) {
    try {
      await handleProfile(req, res, {
        refetch: true
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).end(error.message);
    }
  }