import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import useAsyncHandlerSnippet from "../../../utils/asyncHandlers/useAsyncHandlerSnippet";
import { getAllSnippets, updateSnippet, deleteSnippet } from "../../../services/snippetService";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Button from "../../atoms/button";
import useMediaQueries from "../../../lib/useMediaQueries";

const SnippetsList = () => {
  const isFetchedRef = useRef(false);
  const isFetchedSearchRef = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPageRef = useRef(1);
  const pageLimitRef = useRef(5);
  const [searchSnippets, setSearchSnippets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [snippets, setSnippets] = useState<any[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<any[]>(snippets);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMax1000px } = useMediaQueries();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageLimit: 5,
    totalCount: 0,
  });

  const { asyncHandler: getAllSnippetsHandler } = useAsyncHandlerSnippet("getAllSnippets");
  const { asyncHandler: updateSnippetActiveStateHandler } = useAsyncHandlerSnippet("updateSnippet");
  const { asyncHandler: deleteSnippetHandler } = useAsyncHandlerSnippet("deleteSnippet");

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("dashboard") + 1];
    const fetchSnippets = async () => {
      isFetchedRef.current = true;
      currentPageRef.current = pagination.currentPage;
      pageLimitRef.current = pagination.pageLimit;
      const { data } = await getAllSnippetsHandler(() =>
        getAllSnippets(pagination.currentPage, pagination.pageLimit)
      );
      if (!data) return;
      setSnippets(data.snippet);
      setFilteredSnippets(data.snippet);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: Math.ceil(data.totalCount / pagination.pageLimit),
      }));
    };

    if (
      (activeNav === "snippets" && !isFetchedRef.current) ||
      currentPageRef.current !== pagination.currentPage ||
      pageLimitRef.current !== pagination.pageLimit
    ) {
      fetchSnippets();
    } else if (activeNav !== "snippets") {
      isFetchedRef.current = false;
    }
  }, [location.pathname, getAllSnippetsHandler, pagination.currentPage, pagination.pageLimit]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filterSnippets = (
      snippets: Array<{ name: string; _id: string; contentCreatedBy: string }>
    ) => {
      return snippets.filter(
        ({ name, _id, contentCreatedBy }) =>
          name.toLowerCase().includes(query) ||
          _id.toLowerCase().includes(query) ||
          contentCreatedBy.toLowerCase().includes(query)
      );
    };

    // Fetch snippets if not already fetched
    if (!isFetchedSearchRef.current) {
      const fetchSearchSnippets = async () => {
        const { data } = await getAllSnippetsHandler(() => getAllSnippets());
        isFetchedSearchRef.current = true;
        if (!data) return;
        setSearchSnippets(data.snippet);
        // Once data is fetched, perform the search
        const filteredSnippets = filterSnippets(data.snippet);
        setFilteredSnippets(filteredSnippets);
      };

      await fetchSearchSnippets();
    } else {
      // If snippets are already fetched, proceed with filtering
      if (!searchSnippets) return;
      const filteredSnippets = filterSnippets(searchSnippets);
      if (!query) return setFilteredSnippets(snippets);
      setFilteredSnippets(filteredSnippets);
    }
  };

  const handleActiveState = async (snippetID: string) => {
    const snippetIndex = filteredSnippets.findIndex((snippet) => snippet._id === snippetID);
    if (snippetIndex === -1) return;

    const snippet = filteredSnippets[snippetIndex];
    const updatedSnippet = { ...snippet, active: !snippet.active };

    const { success } = await updateSnippetActiveStateHandler(() =>
      updateSnippet(snippetID, updatedSnippet)
    );
    if (!success) return;
    setFilteredSnippets((prevSnippets) => {
      const updatedSnippets = [...prevSnippets];
      updatedSnippets[snippetIndex] = updatedSnippet;
      return updatedSnippets;
    });
  };

  const handleEditSnippet = (snippetID: string) => {
    const snippet = filteredSnippets.find((snippet) => snippet._id === snippetID);
    if (!snippet.templateID) return navigate(`${snippetID}`, { state: { snippet } });
    if (snippet.templateID) return navigate(`${snippetID}/template`, { state: { snippet } });
  };

  const handleDeleteSnippet = async (snippetID: string) => {
    const { success } = await deleteSnippetHandler(() => deleteSnippet(snippetID));
    if (!success) return;
    setFilteredSnippets((prevSnippets) =>
      prevSnippets.filter((snippet) => snippet._id !== snippetID)
    );
  };

  const handleNewSnippet = () => {
    navigate(`new`);
  };

  const handleNewTemplateSnippet = () => {
    navigate(`new-template`);
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
    const pageLimit = JSON.parse(localStorage.getItem("pageLimit") || "{}").snippet;
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
      JSON.stringify({ ...existingPageLimitData, snippet: pageLimits[newIndex] })
    );
  };

  useEffect(() => {
    const isCollapsedSnippet = JSON.parse(localStorage.getItem("isCollapsed") || "{}").snippet;
    if (isCollapsedSnippet) setIsCollapsed(isCollapsedSnippet);
  }, []);

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);

    const existingCollapsedData = JSON.parse(localStorage.getItem("isCollapsed") || "{}");

    localStorage.setItem(
      "isCollapsed",
      JSON.stringify({ ...existingCollapsedData, snippet: !isCollapsed })
    );
  };

  return (
    <SnippetsContainer>
      <SubHeaderContainer>
        <SubHeaderContainerSearch>
          <StyledMagnifyingGlassIcon />
          <SearchInput
            type="text"
            placeholder="Search Snippets"
            maxLength={35}
            onChange={handleSearchChange}
          />
        </SubHeaderContainerSearch>
        <SubHeaderContainerAction>
          <Button
            type="button"
            onClick={() => handleNewTemplateSnippet()}
            dashed={true}
            style={{
              height: "100%",
              alignSelf: "flex-end",
              backgroundImage: "none",
              padding: isMax1000px ? "0px 20px 0px 20px" : "0px 50px 0px 50px",
            }}
          >
            Use Template
          </Button>

          <Button
            type="button"
            onClick={() => handleNewSnippet()}
            dashed={true}
            style={{
              height: "100%",
              alignSelf: "flex-end",
              backgroundImage: "none",
              padding: isMax1000px ? "0px 20px 0px 20px" : "0px 50px 0px 50px",
            }}
          >
            Create New
          </Button>
        </SubHeaderContainerAction>
      </SubHeaderContainer>
      <SnippetTopActionContainer>
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
      </SnippetTopActionContainer>

      <SnippetList>
        {filteredSnippets.map((snippet: any) => (
          <SnippetItemContainer key={snippet._id} $isCollapsed={isCollapsed}>
            <SnippetItem key={snippet._id}>
              {isCollapsed || (
                <>
                  <p>
                    <SnippetItemTitle>ID</SnippetItemTitle>:
                    <SnippetItemValue>{snippet._id}</SnippetItemValue>
                  </p>
                </>
              )}
              <p>
                <SnippetItemTitle>Name</SnippetItemTitle>:
                <SnippetItemValue>{snippet.name}</SnippetItemValue>
              </p>
              {isCollapsed || (
                <>
                  <p>
                    <SnippetItemTitle>Created by</SnippetItemTitle>:
                    <SnippetItemValue>{snippet.contentCreatedBy}</SnippetItemValue>
                  </p>
                  <p>
                    <SnippetItemTitle>Updated by</SnippetItemTitle>:
                    <SnippetItemValue>{snippet.contentUpdatedBy}</SnippetItemValue>
                  </p>
                </>
              )}
              <p>
                <SnippetItemTitle>Created At</SnippetItemTitle>:
                <SnippetItemValue>{snippet.contentCreatedAt}</SnippetItemValue>
              </p>
              {isCollapsed || (
                <>
                  <p>
                    <SnippetItemTitle>Updated At</SnippetItemTitle>:
                    <SnippetItemValue>{snippet.contentUpdatedAt}</SnippetItemValue>
                  </p>
                </>
              )}
            </SnippetItem>
            <SnippetActionContainer>
              <SnippetItemButton onClick={() => handleActiveState(snippet._id)}>
                {snippet.active ? <StyledOpenEyeIcon /> : <StyledCloseEyeIcon />}
              </SnippetItemButton>

              <SnippetItemButton onClick={() => handleEditSnippet(snippet._id)}>
                <StyledMdEditIcon />
              </SnippetItemButton>

              <SnippetItemButton onClick={() => handleDeleteSnippet(snippet._id)}>
                <StyledBinIcon />
              </SnippetItemButton>
            </SnippetActionContainer>
          </SnippetItemContainer>
        ))}
      </SnippetList>
      <PaginationControls>
        {searchQuery ? (
          <>
            <span>Total Search Results ({filteredSnippets.length})</span>
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
    </SnippetsContainer>
  );
};

export default SnippetsList;

const SnippetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  @media (width <= 650px) {
    flex-direction: column-reverse;
  }
`;

const SubHeaderContainerSearch = styled.div`
  display: flex;
  align-items: center;
`;

const SubHeaderContainerAction = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: flex-end;
`;

const SearchInput = styled.input`
  padding: 12px 10px 10px 0px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.basic.white};
  font-size: 2.5rem;
  flex: 1;
  font-family: inherit;
  margin-left: 10px;
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

const SnippetList = styled.ul`
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

const SnippetItemContainer = styled.li<{ $isCollapsed: boolean }>`
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

    @media (width <= 650px) {
      align-items: ${$isCollapsed ? "center" : "unset"};
    }
  `}
`;

const SnippetItem = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 10px 5vw;
  width: 70%;
  white-space: nowrap;

  p {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  @media (width <= 1500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const SnippetTopActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  height: 30px;
  margin: 10px 0px 10px 20px;
`;

const SnippetActionContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (width <= 650px) {
    gap: 0px;
    flex-direction: column;
  }
`;

const SnippetItemButton = styled.button`
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

const SnippetItemTitle = styled.span`
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

const SnippetItemValue = styled.span`
  margin-left: 10px;
  width: 20vw;
  height: 18px;
  overflow: scroll;
  @media (width <= 1500px) {
    width: 45vw;
  }

  @media (width <= 800px) {
    margin-left: 0px;
  }

  @media (width <= 650px) {
    width: 55vw;
  }
`;

const commonIconStyles = css`
  font-size: 2rem;
  display: inline-block;
`;

const StyledMdEditIcon = styled(MdEdit)`
  ${commonIconStyles}
`;

const StyledOpenEyeIcon = styled(FaRegEye)`
  ${commonIconStyles}
`;

const StyledCloseEyeIcon = styled(FaRegEyeSlash)`
  ${commonIconStyles}
`;

const StyledBinIcon = styled(IoTrashBin)`
  ${commonIconStyles}
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
