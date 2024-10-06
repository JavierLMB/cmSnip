import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import useAsyncHandlerTemplate from "../../../utils/asyncHandlers/useAsyncHandlerTemplate";
import { getAllTemplates, updateTemplate, deleteTemplate } from "../../../services/templateService";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Button from "../../atoms/button";
import useMediaQueries from "../../../lib/useMediaQueries";

const TemplatesList = () => {
  const isFetchedRef = useRef(false);
  const isFetchedSearchRef = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPageRef = useRef(1);
  const pageLimitRef = useRef(5);
  const [searchTemplates, setSearchTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>(templates);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMax1000px } = useMediaQueries();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageLimit: 5,
    totalCount: 0,
  });

  const { asyncHandler: getAllTemplatesHandler } = useAsyncHandlerTemplate("getAllTemplates");
  const { asyncHandler: updateTemplateActiveStateHandler } =
    useAsyncHandlerTemplate("updateTemplate");
  const { asyncHandler: deleteTemplateHandler } = useAsyncHandlerTemplate("deleteTemplate");

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("dashboard") + 1];
    const fetchTemplates = async () => {
      isFetchedRef.current = true;
      currentPageRef.current = pagination.currentPage;
      pageLimitRef.current = pagination.pageLimit;
      const { data } = await getAllTemplatesHandler(() =>
        getAllTemplates(pagination.currentPage, pagination.pageLimit)
      );
      if (!data) return;
      setTemplates(data.template);
      setFilteredTemplates(data.template);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: Math.ceil(data.totalCount / pagination.pageLimit),
      }));
    };

    if (
      (activeNav === "templates" && !isFetchedRef.current) ||
      currentPageRef.current !== pagination.currentPage ||
      pageLimitRef.current !== pagination.pageLimit
    ) {
      fetchTemplates();
    } else if (activeNav !== "templates") {
      isFetchedRef.current = false;
    }
  }, [location.pathname, getAllTemplatesHandler, pagination.currentPage, pagination.pageLimit]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filterTemplates = (
      templates: Array<{ name: string; _id: string; contentCreatedBy: string }>
    ) => {
      return templates.filter(
        ({ name, _id, contentCreatedBy }) =>
          name.toLowerCase().includes(query) ||
          _id.toLowerCase().includes(query) ||
          contentCreatedBy.toLowerCase().includes(query)
      );
    };

    // Fetch templates if not already fetched
    if (!isFetchedSearchRef.current) {
      const fetchSearchTemplates = async () => {
        const { data } = await getAllTemplatesHandler(() => getAllTemplates());
        isFetchedSearchRef.current = true;
        if (!data) return;
        setSearchTemplates(data.template);
        // Once data is fetched, perform the search
        const filteredTemplates = filterTemplates(data.template);
        setFilteredTemplates(filteredTemplates);
      };

      await fetchSearchTemplates();
    } else {
      // If templates are already fetched, proceed with filtering
      if (!searchTemplates) return;
      const filteredTemplates = filterTemplates(searchTemplates);
      if (!query) return setFilteredTemplates(templates);
      setFilteredTemplates(filteredTemplates);
    }
  };

  const handleActiveState = async (templateID: string) => {
    const templateIndex = filteredTemplates.findIndex((template) => template._id === templateID);
    if (templateIndex === -1) return;

    const template = filteredTemplates[templateIndex];
    const updatedTemplate = { ...template, active: !template.active };

    const { success } = await updateTemplateActiveStateHandler(() =>
      updateTemplate(templateID, updatedTemplate)
    );
    if (!success) return;
    setFilteredTemplates((prevTemplates) => {
      const updatedTemplates = [...prevTemplates];
      updatedTemplates[templateIndex] = updatedTemplate;
      return updatedTemplates;
    });
  };

  const handleEditTemplate = (templateID: string) => {
    const template = filteredTemplates.find((template) => template._id === templateID);
    if (template) navigate(`${templateID}`, { state: { template } });
  };

  const handleDeleteTemplate = async (templateID: string) => {
    const { success } = await deleteTemplateHandler(() => deleteTemplate(templateID));
    if (!success) return;
    setFilteredTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template._id !== templateID)
    );
  };

  const handleNewTemplate = () => {
    navigate(`new`);
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
    const pageLimit = JSON.parse(localStorage.getItem("pageLimit") || "{}").template;
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
      JSON.stringify({ ...existingPageLimitData, template: pageLimits[newIndex] })
    );
  };

  useEffect(() => {
    const isCollapsedTemplate = JSON.parse(localStorage.getItem("isCollapsed") || "{}").template;
    if (isCollapsedTemplate) setIsCollapsed(isCollapsedTemplate);
  }, []);

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);
    const existingCollapsedData = JSON.parse(localStorage.getItem("isCollapsed") || "{}");

    localStorage.setItem(
      "isCollapsed",
      JSON.stringify({ ...existingCollapsedData, template: !isCollapsed })
    );
  };

  return (
    <TemplatesContainer>
      <SubHeaderContainer>
        <SubHeaderContainerSearch>
          <StyledMagnifyingGlassIcon />
          <SearchInput
            type="text"
            placeholder="Search Templates"
            maxLength={35}
            onChange={handleSearchChange}
          />
        </SubHeaderContainerSearch>
        <SubHeaderContainerAction>
          <Button
            type="button"
            onClick={() => handleNewTemplate()}
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

      <TemplateTopActionContainer>
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
      </TemplateTopActionContainer>

      <TemplateList>
        {filteredTemplates.map((template: any) => (
          <TemplateItemContainer key={template._id} $isCollapsed={isCollapsed}>
            <TemplateItem key={template._id}>
              {isCollapsed || (
                <>
                  <p>
                    <TemplateItemTitle>ID</TemplateItemTitle>:
                    <TemplateItemValue>{template._id}</TemplateItemValue>
                  </p>
                </>
              )}
              <p>
                <TemplateItemTitle>Name</TemplateItemTitle>:
                <TemplateItemValue>{template.name}</TemplateItemValue>
              </p>
              {isCollapsed || (
                <>
                  <p>
                    <TemplateItemTitle>Created by</TemplateItemTitle>:
                    <TemplateItemValue>{template.contentCreatedBy}</TemplateItemValue>
                  </p>
                  <p>
                    <TemplateItemTitle>Updated by</TemplateItemTitle>:
                    <TemplateItemValue>{template.contentUpdatedBy}</TemplateItemValue>
                  </p>
                </>
              )}
              <p>
                <TemplateItemTitle>Created At</TemplateItemTitle>:
                <TemplateItemValue>{template.contentCreatedAt}</TemplateItemValue>
              </p>
              {isCollapsed || (
                <>
                  <p>
                    <TemplateItemTitle>Updated At</TemplateItemTitle>:
                    <TemplateItemValue>{template.contentUpdatedAt}</TemplateItemValue>
                  </p>
                </>
              )}
            </TemplateItem>
            <TemplateActionContainer>
              <TemplateItemButton onClick={() => handleActiveState(template._id)}>
                {template.active ? <StyledOpenEyeIcon /> : <StyledCloseEyeIcon />}
              </TemplateItemButton>

              <TemplateItemButton onClick={() => handleEditTemplate(template._id)}>
                <StyledMdEditIcon />
              </TemplateItemButton>

              <TemplateItemButton onClick={() => handleDeleteTemplate(template._id)}>
                <StyledBinIcon />
              </TemplateItemButton>
            </TemplateActionContainer>
          </TemplateItemContainer>
        ))}
      </TemplateList>
      <PaginationControls>
        {searchQuery ? (
          <>
            <span>Total Search Results ({filteredTemplates.length})</span>
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
    </TemplatesContainer>
  );
};

export default TemplatesList;

const TemplatesContainer = styled.div`
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
`;

const SubHeaderContainerAction = styled.div`
  display: flex;
  margin-left: auto;
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

const TemplateList = styled.ul`
  list-style-type: none;
  padding: 20px 20px 0px 0px;
  border-radius: 10px;
  overflow-y: auto;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.basic.white};
  height: 600px;
  width: 100%;

  @media (width <= 800px) {
    padding: 20px 10px 0px 0px;
  }
`;

const TemplateItemContainer = styled.li<{ $isCollapsed: boolean }>`
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

const TemplateItem = styled.div`
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

const TemplateTopActionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  height: 30px;
  margin: 10px 0px 10px 20px;
`;

const TemplateActionContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (width <= 650px) {
    gap: 0px;
    flex-direction: column;
  }
`;

const TemplateItemButton = styled.button`
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

const TemplateItemTitle = styled.span`
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

const TemplateItemValue = styled.span`
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
