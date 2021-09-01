import styled from 'styled-components'
import { useProfile } from '../lib/user-profile';

export default function Home() {
  // Retrieve user profile from our custom React hook
  const { profile, isError, isLoading } = useProfile();

  // Debug statements are useful for seeing when useSWR updates the profile during mutate vs. refetch
  console.log("Home Page");
  console.log(profile);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{isError.message}</div>;

  if (profile) {
    return (
      <Container>
        <Title>
          Profile
        </Title>
        <Picture src={profile?.picture}>
        </Picture>
        <div>
          <b>Nickname:</b> {profile?.nickname} <br></br>
          <b>Email:</b> {profile?.email} <br></br>
          <b>Verified:</b> {(profile?.email_verified) ? "true" : "false"}
        </div>
        
        <Button as="a" href="/edit">Edit profile</Button>
        <Button as="a" href="/api/auth/logout">Logout</Button>
      </Container>
    );
  } else {
    return (<Button as="a" href="/api/auth/login">Login</Button>);
  }

  
}

const Container = styled.div`
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem
`;

const Title = styled.h1`
  color: Black;
  font-size: 2rem;
`;

const Picture = styled.img`
  width: 40px;
  height: 40px;
`;

const Button = styled.button`
  display: block;
  font-size: 1rem;
  margin: 1rem 0rem;
  padding: 0.25rem 1rem;
  border: 2px solid black;
  border-radius: 3px;
  width: fit-content;
`;
