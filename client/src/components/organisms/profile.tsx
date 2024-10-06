import React, { useState, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../lib/useAtom";
import styled, { css } from "styled-components";
import useAsyncHandlerUser from "../../utils/asyncHandlers/useAsyncHandlerUser";
import { getMe, updateMe } from "../../services/userService";
import useAsyncHandlerAuth from "../../utils/asyncHandlers/useAsyncHandlerAuth";
import { logout } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../atoms/button";
import StatusMessage from "../atoms/statusMessage";
import { PiPersonSimpleLight } from "react-icons/pi";
import ThemePicker from "../atoms/themePicker";
import useMediaQueries from "../../lib/useMediaQueries";

const ProfilePage = () => {
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);
  const isFetchedRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMax1000px } = useMediaQueries();

  const [updateName, setUpdateName] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    id: "",
    email: "",
    role: "",
  });

  const { asyncHandler: getMeHandler } = useAsyncHandlerUser("getMe");
  const { asyncHandler: updateMeHandler } = useAsyncHandlerUser("updateMe");
  const { asyncHandler: logoutHandler } = useAsyncHandlerAuth("logout");

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("dashboard") + 1];

    if (activeNav === "profile" && !isFetchedRef.current) {
      const fetchMe = async () => {
        isFetchedRef.current = true;
        const { data } = await getMeHandler(() => getMe());
        if (!data) return;
        setProfileData({ ...data.user });
      };
      fetchMe();
    } else if (activeNav !== "profile") {
      isFetchedRef.current = false;
    }
  }, [location.pathname, getMeHandler]);

  const handleNewNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = e.currentTarget.newName.value;
    const updatedProfileData = { ...profileData, name: newName };
    setProfileData(updatedProfileData);
    await updateMeHandler(() => updateMe(updatedProfileData));
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setUpdateName(true);
    setProfileData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateName(false);
    await updateMeHandler(() => updateMe(profileData));
  };

  const handleForgotPassword = () => {
    navigate(`/auth/forgot-password`);
  };

  const handleLogout = async () => {
    await logoutHandler(() => logout());
    navigate("/auth/account");
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Profile View</Title>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Profile</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </ProfileHeader>
      {profileData.name ? (
        <>
          <SubHeaderContainer>
            <SubHeaderContainerSearch>
              <StyledPersonIcon />
              <ProfileWelcomeMessage>{profileData.name}'s Profile</ProfileWelcomeMessage>
            </SubHeaderContainerSearch>
          </SubHeaderContainer>
          <FormContainer onSubmit={handleSubmit} autoComplete="off">
            <ProfileItemContainer>
              <ProfileItem>
                <p>
                  <ProfileItemTitleLabel htmlFor="name">Name</ProfileItemTitleLabel>:
                  <ProfileItemValueTextArea
                    id="name"
                    value={profileData.name}
                    onChange={handleChange}
                    rows={1}
                  >
                    {profileData.name}
                  </ProfileItemValueTextArea>
                </p>
                <p>
                  <ProfileItemTitle>ID</ProfileItemTitle>:
                  <ProfileItemValue>{profileData.id}</ProfileItemValue>
                </p>
                <p>
                  <ProfileItemTitle>Email</ProfileItemTitle>:
                  <ProfileItemValue>{profileData.email}</ProfileItemValue>
                </p>
                <p>
                  <ProfileItemTitle>Role</ProfileItemTitle>:
                  <ProfileItemValue>{profileData.role}</ProfileItemValue>
                </p>
              </ProfileItem>
            </ProfileItemContainer>
            {updateName && (
              <Button
                type="submit"
                style={{ height: "36px", width: "150px", alignSelf: "flex-end" }}
              >
                Update
              </Button>
            )}
          </FormContainer>
        </>
      ) : (
        <SubHeaderContainer>
          <StyledPersonIcon />
          <NewNameform onSubmit={handleNewNameSubmit} autoComplete="off">
            <NewNameInput
              type="text"
              placeholder="Set up your profile name"
              name="newName"
              maxLength={35}
            />
            <Button
              type="submit"
              dashed={true}
              style={{
                height: "100%",
                alignSelf: "flex-end",
                backgroundImage: "none",
                padding: isMax1000px ? "0px 20px 0px 20px" : "0px 50px 0px 50px",
              }}
            >
              Save Name
            </Button>
          </NewNameform>
        </SubHeaderContainer>
      )}

      <ActionContainer>
        <ThemePicker />
        <ActionItem onClick={() => handleForgotPassword()}>Forgot password?</ActionItem>
        <ActionItem onClick={() => handleLogout()}>Logout</ActionItem>
      </ActionContainer>
    </ProfileContainer>
  );
};

export default ProfilePage;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  @media (width <= 650px) {
    flex-direction: column-reverse;
  }
`;

const SubHeaderContainerSearch = styled.div`
  display: flex;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  @media (width <= 650px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Title = styled.h1`
  ${({ theme }) => css`
    color: ${theme.colors.basic.white};
    font-size: ${theme.fonts.header2Font};
  `}
`;

const NewNameform = styled.form`
  display: flex;
  flex: 1;
`;

const NewNameInput = styled.input`
  padding: 12px 10px 10px 0px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.basic.white};
  font-size: 2.5rem;
  flex: 1;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
  }
  &::placeholder {
    background: linear-gradient(
      165deg,
      ${({ theme }) => theme.colors.accent.accent1},
      ${({ theme }) => theme.colors.accent.accent2}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    text-transform: uppercase;
  }
`;

const ProfileWelcomeMessage = styled.div`
  padding: 12px 10px 10px 0px;
  border: none;
  background-color: transparent;
  font-size: 2.5rem;
  flex: 1;
  font-family: inherit;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.colors.accent.accent1},
    ${({ theme }) => theme.colors.accent.accent2}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  text-transform: uppercase;
  margin-left: 10px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 20px 20px 0px 0px;
  color: ${({ theme }) => theme.colors.basic.white};

  h2 {
    margin-bottom: 1rem;
  }

  @media (width <= 800px) {
    padding: 20px 10px 0px 0px;
  }
`;

const ProfileItemContainer = styled.li`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => css`
    font-size: ${theme.fonts.defaultFont};
    padding: 0px 10px 20px 20px;
  `}

  @media (width <= 800px) {
    padding: 0px 10px 10px 10px;
  }
`;

const ProfileItem = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.fonts.defaultFont};
  `}

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

const ProfileItemTitleLabel = styled.label`
  font-weight: bold;
  width: 120px;
  display: inline-block;
  @media (width <= 800px) {
    width: 100px;
  }
  @media (width <= 650px) {
    width: 35px;
    overflow: scroll;
  }
`;

const ProfileItemValueTextArea = styled.textarea`
  margin-left: 10px;
  padding: 1px;
  border-radius: 2px;
  width: 45vw;
  height: 18px;
  overflow: scroll;
  white-space: nowrap;
  @media (width <= 800px) {
    margin-left: 0px;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent.accent1};
    outline-offset: 4px;
  }

  @media (width <= 650px) {
    width: 55vw;
  }
`;

const ProfileItemTitle = styled.span`
  font-weight: bold;
  width: 120px;
  display: inline-block;
  @media (width <= 800px) {
    width: 100px;
  }
  @media (width <= 650px) {
    width: 35px;
    overflow: scroll;
  }
`;

const ProfileItemValue = styled.span`
  margin-left: 10px;
  width: 45vw;
  height: 18px;
  overflow: scroll;
  @media (width <= 800px) {
    margin-left: 0px;
  }

  @media (width <= 650px) {
    width: 55vw;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: ${({ theme }) => theme.colors.basic.white};
`;

const ActionItem = styled.div`
  cursor: pointer;
  display: inline-block;
  align-self: flex-end;
  &:hover {
    text-decoration: underline;
  }
`;

const commonIconStyles = css`
  font-size: 2rem;
  display: inline-block;
`;

const StyledPersonIcon = styled(PiPersonSimpleLight)`
  ${commonIconStyles}
  font-size: 3em;
  color: ${({ theme }) => theme.colors.accent.accent1};
  height: 100%;
  margin-left: 20px;
  @media (width <= 800px) {
    margin-left: 10px;
  }
`;
