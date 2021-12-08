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

  function getFormData() {
    var newData = {
      "nickname": document.getElementById('nickname').value,
      "email": document.getElementById('email').value,
      "email_verified": document.getElementById('email_verified').checked,
      "picture": document.getElementById('picture').value
    };
    console.log(newData);
    if (newData.email_verified == "on")
      newData.email_verified = true;
    if (newData.email_verified == "off")
      newData.email_verified = false;
    
    return newData;
  }
  
  async function updateUserSession(formData) {
    // Update the local data at /api/auth/me immediately via mutate, and disable the useSWR revalidation (since we want to use the new cached version)
    // NOTE: key is not required when using useSWR's mutate as it's pre-bound (https://swr.vercel.app/docs/mutation#bound-mutate)
    mutate(async profile => {
      profile.nickname = formData.nickname;
      profile.email = formData.email;
      profile.email_verified = formData.email_verified;
      profile.picture = formData.picture;
    }, false);

    // Update the Auth0 profile too, but dont await a response since we already cached the current values with useSWR mutate.
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
        <Picture id="picture" {...register("picture")} src={profile?.picture}>
        </Picture>
        <form> 
            <Label as="label">
                <span>Nickname</span>
                <input id="nickname" {...register("nickname")} type="text"></input>
            </Label>
            <Label>
                <span>Email</span>
                <input id="email" {...register("email")} type="text"></input>
            </Label>
            <Label>
                <span>Verified</span>
                <input id="email_verified" {...register("email_verified")} type="checkbox"></input>
            </Label>

            <PrimaryButton name="yesswr" as="a" onClick={() => {
              var newData = getFormData(); 
              updateUserSession(newData);
            }}>Save using SWR</PrimaryButton>

            <Button name="noswr" as="a" onClick={() => {
              var newData = getFormData(); 
              updateUserSessionWithoutSWR(newData);
            }}>Save without SWR</Button>

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
