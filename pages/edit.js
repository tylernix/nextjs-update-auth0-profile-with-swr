import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { useProfile } from '../lib/user-profile';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Edit() {
  const router = useRouter();

  // Retrieve user profile from our custom React hook
  const { profile, isError, isLoading, mutate, updateProfile } = useProfile();

  // Populate HTML form with current profile values
  const { register, handleSubmit, watch, reset } = useForm({defaultValues: profile});

  // Update (i.e. reset) the form with the current profile values when profile eventually updates from our custom React hook useProfile()
  // Necessary since on initial React component load, the profile is 'undefined'.
  useEffect(() => {
    // Debug statements are useful for seeing when useSWR updates the profile during mutate and refetch
    console.log("Edit Page");
    console.log(profile); 

    reset(profile);
  }, [profile]);
  
  async function updateUserSession(formData) {
    const newProfile = {
      nickname: formData.nickname,
      email: formData.email,
      email_verified: formData.email_verified,
      picture: formData.picture
    }

    // Update the local data at /api/auth/me immediately, but disable the useSWR revalidation
    // NOTE: key is not required when using useSWR's mutate as it's pre-bound
    mutate({...newProfile}, false);

    // Update the Auth0 profile too, but down await a response since we already cached the current values with useSWR mutate
    updateProfile(formData);
    router.replace('/');
  }


  async function updateUserSessionWithoutSWR(formData) {
    // We must await a response since at the end of the updateProfile function, it calls /api/auth/refetch to update the local nextjs-auth0 cookie.
    await updateProfile(formData);
    router.replace('/');
  }
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{isError.message}</div>;
 
  if (profile) {
    return (
      <Container>
        <Title>
          Profile
        </Title>
        <Picture {...register("picture")} src={profile?.picture}>
        </Picture>
        <form onSubmit={handleSubmit((formData, e) => {
            const buttonName = e.nativeEvent.submitter.name;
            if (buttonName === "yesswr") {
              updateUserSession(formData);
            }
            if (buttonName === "noswr") {
              updateUserSessionWithoutSWR(formData);
            }
          })}> 
          

            <Label as="label">
                <span>Nickname</span>
                <input {...register("nickname")} type="text"></input>
            </Label>
            <Label>
                <span>Email</span>
                <input {...register("email")} type="text"></input>
            </Label>
            <Label>
                <span>Verified</span>
                <input {...register("email_verified")} type="checkbox"></input>
            </Label>
            <PrimaryButton type="submit" name="yesswr">Save using SWR</PrimaryButton>
            <Button type="submit" name="noswr">Save without SWR</Button>
            <Button as="a" onClick={() => {
              reset();
              router.back();
            }}>Cancel</Button>
        </form>

        {/* <div>
          <b>Nickname:</b> {watch("nickname", profile.nickname) || profile.nickname} <br></br>
          <b>Email:</b> {watch("email", profile.email) || profile.email} <br></br>
          <b>Verified:</b> {watch("email_verified", profile.email_verified) || (profile.email_verified) ? "true" : "false"}
        </div> */}
        
      </Container>
    );
  }
  return <Button as="a" href="/api/auth/login">Login to view profile</Button>;
}

const Container = styled.div`
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem
`;

const Label = styled.label`
    display: block;
    padding: .25rem 0rem;
`;

const Title = styled.h1`
  color: Black;
  font-size: 2rem;
`;

const Picture = styled.img`
  width: 40px;
  height: 40px;
`;

const PrimaryButton = styled.button`
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 0rem;
  margin-right: .5rem;
  background: black;
  color: white;
  padding: 0.25rem 1rem;
  border: 2px solid black;
  border-radius: 3px;
  width: fit-content;
`;

const Button = styled.button`
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 0rem;
  margin-right: .5rem;
  padding: 0.25rem 1rem;
  border: 2px solid black;
  border-radius: 3px;
  width: fit-content;
`;
