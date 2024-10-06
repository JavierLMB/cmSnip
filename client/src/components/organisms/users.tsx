import React, { useState, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../lib/useAtom";
import styled, { css } from "styled-components";
import useAsyncHandlerUser from "../../utils/asyncHandlers/useAsyncHandlerUser";
import { getAllUsers, updateUserRole, deleteUser } from "../../services/userService";
import StatusMessage from "../atoms/statusMessage";
import { useLocation } from "react-router-dom";
import Dropdown from "../atoms/dropdown";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoTrashBin } from "react-icons/io5";
import Button from "../atoms/button";
import useMediaQueries from "../../lib/useMediaQueries";

const Users = () => {
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);
  const isFetchedRef = useRef(false);
  const isFetchedSearchRef = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPageRef = useRef(1);
  const pageLimitRef = useRef(5);
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>(users);
  const location = useLocation();
  const { isMax800px, isMax1000px } = useMediaQueries();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageLimit: 5,
    totalCount: 0,
  });

  const { asyncHandler: getAllUsersHandler } = useAsyncHandlerUser("getAllUsers");
  const { asyncHandler: deleteUserHandler } = useAsyncHandlerUser("deleteUser");
  const { asyncHandler: updateUserRoleHandler } = useAsyncHandlerUser("updateUserRole");

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("dashboard") + 1];
    const fetchUsers = async () => {
      isFetchedRef.current = true;
      currentPageRef.current = pagination.currentPage;
      pageLimitRef.current = pagination.pageLimit;
      const { data } = await getAllUsersHandler(() =>
        getAllUsers(pagination.currentPage, pagination.pageLimit)
      );
      if (!data) return;
      setUsers(data.user);
      setFilteredUsers(data.user);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: Math.ceil(data.totalCount / pagination.pageLimit),
      }));
    };

    if (
      (activeNav === "users" && !isFetchedRef.current) ||
      currentPageRef.current !== pagination.currentPage ||
      pageLimitRef.current !== pagination.pageLimit
    ) {
      fetchUsers();
    } else if (activeNav !== "users") {
      isFetchedRef.current = false;
    }
  }, [location.pathname, getAllUsersHandler, pagination.currentPage, pagination.pageLimit]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { success } = await updateUserRoleHandler(() => updateUserRole(userId, newRole));
    if (!success) return;
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
    );
  };

  const handleDeleteUser = async (UserID: string) => {
    const { success } = await deleteUserHandler(() => deleteUser(UserID));
    if (!success) return;
    setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== UserID));
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fetchSearchUsers = async () => {
      const { data } = await getAllUsersHandler(() => getAllUsers());
      isFetchedSearchRef.current = true;
      if (!data) return;
      setSearchUsers(data.user);
    };

    if (!isFetchedSearchRef.current) {
      await fetchSearchUsers();
    }

    if (!searchUsers) return;

    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredUsers = users.filter(
      (user: { email: string; role: string; _id: string }) =>
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user._id.toLowerCase().includes(query)
    );
    if (!query) return setFilteredUsers(users);
    setFilteredUsers(filteredUsers);
  };

  const handlePagination = (direction: "next" | "previous") => {
    setPagination((prev) => {
      let newPage = prev.currentPage;

      if (direction === "next" && prev.currentPage < prev.totalPages) {
        newPage += 1;
      } else if (direction === "previous" && prev.currentPage > 1) {
        newPage -= 1;
      }

      return {
        ...prev,
        currentPage: newPage,
      };
    });
  };

  useEffect(() => {
    const pageLimit = JSON.parse(localStorage.getItem("pageLimit") || "{}").user;
    if (pageLimit) {
      setPagination((prev) => ({
        ...prev,
        pageLimit,
      }));
    }
  }, []);

  const handlePageLimits = () => {
    const pageLimits = [5, 10, 25, 50, 100];
    const currentIndex = pageLimits.indexOf(pagination.pageLimit);
    const newIndex = currentIndex + 1 >= pageLimits.length ? 0 : currentIndex + 1;
    setPagination((prev) => ({
      ...prev,
      pageLimit: pageLimits[newIndex],
    }));

    const existingPageLimitData = JSON.parse(localStorage.getItem("pageLimit") || "{}");
    localStorage.setItem(
      "pageLimit",
      JSON.stringify({ ...existingPageLimitData, user: pageLimits[newIndex] })
    );
  };

  useEffect(() => {
    const isCollapsedSnippet = JSON.parse(localStorage.getItem("isCollapsed") || "{}").user;
    if (isCollapsedSnippet) setIsCollapsed(isCollapsedSnippet);
  }, []);

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);

    const existingCollapsedData = JSON.parse(localStorage.getItem("isCollapsed") || "{}");

    localStorage.setItem(
      "isCollapsed",
      JSON.stringify({ ...existingCollapsedData, user: !isCollapsed })
    );
  };

  return (
    <UsersContainer>
      <UsersHeader>
        <Title>Users View</Title>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Users</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </UsersHeader>
      <SubHeaderContainer>
        <SubHeaderContainerSearch>
          <StyledMagnifyingGlassIcon />
          <SearchInput
            type="text"
            placeholder="Search Users"
            maxLength={35}
            onChange={handleSearchChange}
          />
        </SubHeaderContainerSearch>
      </SubHeaderContainer>
      <UserTopActionContainer>
        <Button
          type="button"
          onClick={() => handlePageLimits()}
          dashed={true}
          style={{
            height: "30px",
            alignSelf: "flex-end",
            padding: isMax1000px ? "0px 20px 0px 20px" : "0px 50px 0px 50px",
          }}
        >
          Show ({pagination.pageLimit})
        </Button>
        <Button
          type="button"
          onClick={() => handleIsCollapsed()}
          dashed={true}
          style={{
            height: "30px",
            alignSelf: "flex-end",
            padding: isMax1000px ? "0px 20px 0px 20px" : "0px 50px 0px 50px",
          }}
        >
          {isCollapsed ? "Expand" : "Collapse"}
        </Button>
      </UserTopActionContainer>
      <UserList>
        {filteredUsers.map((user: any) => (
          <UserItemContainer key={user._id} $isCollapsed={isCollapsed}>
            <UserItem key={user._id}>
              {isCollapsed || (
                <>
                  <p>
                    <UserItemTitle>ID</UserItemTitle>: <UserItemValue>{user._id}</UserItemValue>
                  </p>
                </>
              )}
              <p>
                <UserItemTitle>Email</UserItemTitle>: <UserItemValue>{user.email}</UserItemValue>
              </p>
              <RoleDropdown>
                <label htmlFor={`role-${user._id}`}>
                  <UserItemTitle>Role</UserItemTitle>:
                </label>
                <Dropdown
                  options={["admin", "editor", "viewer", "guest"]}
                  selectedOption={user.role}
                  onOptionSelect={(option) => handleRoleChange(user._id, option)}
                  style={{
                    fontSize: "1.6rem",
                    padding: "0px 0px 0px 0px",
                    width: "165px",
                    marginLeft: isMax800px ? "0px" : "10px",
                  }}
                />
              </RoleDropdown>
            </UserItem>
            <UserActionContainer>
              <UserItemButton onClick={() => handleDeleteUser(user._id)}>
                <StyledBinIcon />
              </UserItemButton>
            </UserActionContainer>
          </UserItemContainer>
        ))}
      </UserList>
      <PaginationControls>
        {searchQuery ? (
          <>
            <span>Total Search Results ({filteredUsers.length})</span>
          </>
        ) : (
          <>
            <span>Total Results ({pagination.totalCount}) -</span>
            <button
              onClick={() => handlePagination("previous")}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            <span>
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
            <button
              onClick={() => handlePagination("next")}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </>
        )}
      </PaginationControls>
    </UsersContainer>
  );
};

export default Users;

const UsersContainer = styled.div`
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

const UsersHeader = styled.div`
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

const SearchInput = styled.input`
  padding: 12px 10px 10px 0px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.basic.white};
  font-size: 2.5rem;
  flex: 1;
  font-family: inherit;
  width: 100%;
  margin-left: 10px;

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

const UserList = styled.ul`
  list-style-type: none;
  padding: 20px 20px 0px 0px;
  border-radius: 10px;
  overflow-y: auto;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.basic.white};
  width: 100%;
  height: 600px;

  @media (width <= 800px) {
    padding: 20px 10px 0px 0px;
  }
`;

const UserItemContainer = styled.li<{ $isCollapsed: boolean }>`
  display: flex;
  justify-content: space-between;

  @media (width <= 800px) {
    padding: 0px 10px 10px 10px;
  }

  ${({ theme, $isCollapsed }) => css`
    font-size: ${theme.fonts.defaultFont};
    padding: 0px 10px 20px 20px;
    &:not(:last-child) {
      margin-bottom: ${$isCollapsed ? "10px" : "20px"};
    }
  `}
`;

const UserItem = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 10px 5vw;
  width: 70%;
  white-space: nowrap;
  p {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

const UserTopActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  height: 30px;
  margin: 10px 0px 10px 20px;
`;

const UserActionContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (width <= 650px) {
    gap: 0px;
    flex-direction: column;
  }
`;

const UserItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  transition: background-color 0.1s ease;
  border-radius: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const UserItemTitle = styled.span`
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

const UserItemValue = styled.span`
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

const RoleDropdown = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  label {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  select {
    padding: 0px 5px 5px 5px;
    border: none;
    margin-left: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.basic.white};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.basic.white};
    font-size: ${({ theme }) => theme.fonts.defaultFont};

    &:focus {
      outline: none;
    }
  }

  option {
    color: ${({ theme }) => theme.colors.basic.white};
    background-color: ${({ theme }) => theme.colors.primary.dark};
    &:hover {
      background-color: ${({ theme }) => theme.colors.accent.accent1} !important;
    }
  }
`;

const commonIconStyles = css`
  font-size: 2rem;
  display: inline-block;
`;

const StyledMagnifyingGlassIcon = styled(HiMagnifyingGlass)`
  ${commonIconStyles}
  font-size: 3em;
  color: ${({ theme }) => theme.colors.accent.accent1};
  rotate: 90deg;
  height: 100%;
  margin-left: 20px;
  @media (width <= 800px) {
    margin-left: 10px;
  }
`;

const StyledBinIcon = styled(IoTrashBin)`
  ${commonIconStyles}
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  margin: 10px auto 20px 20px;

  @media (width <= 800px) {
    margin: 10px auto 20px 10px;
  }

  button {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.basic.white};
    cursor: pointer;
    border-radius: 4px;

    &:disabled {
      cursor: not-allowed;
      display: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    color: ${({ theme }) => theme.colors.basic.white};
  }
`;
