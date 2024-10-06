import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import useAsyncHandlerUser from "../utils/asyncHandlers/useAsyncHandlerUser";
import { getMe } from "../services/userService";
import { IoWarningOutline } from "react-icons/io5";

type RoleSpecificAccessProps = {
  children: any;
  roles: string[];
};

const RoleSpecificAccess: React.FC<RoleSpecificAccessProps> = ({ children, roles }) => {
  const [userAccess, setUserAccess] = useState(true);
  const { asyncHandler: getMeHandler } = useAsyncHandlerUser("getMe");
  const isInitialRender = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isInitialRender.current) return;
      isInitialRender.current = true;
      const { data } = await getMeHandler(() => getMe());
      if (!data) return;
      const userRole = data.user.role;
      setUserAccess(roles.includes(userRole));
    };
    fetchUser();
  }, [getMeHandler, roles]);

  if (!userAccess) {
    return (
      <ForbiddenPageWrapper>
        <ForbiddenMessageBox>
          <div>
            <ForbiddenMessageTitle>
              <StyledWarningIcon /> <span>403 - FORBIDDEN</span> <StyledWarningIcon />
            </ForbiddenMessageTitle>
          </div>
          <div>You do not have permission to access this resource.</div>
          <div>Please contact your administrator if you believe this is an error.</div>
        </ForbiddenMessageBox>
      </ForbiddenPageWrapper>
    );
  }

  return <>{children}</>;
};

export default RoleSpecificAccess;

const ForbiddenPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const ForbiddenMessageBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.primary.dark};
  color: ${({ theme }) => theme.colors.basic.white};
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fonts.smallFont};
  font-weight: 600;
`;
const ForbiddenMessageTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.defaultFont};
  gap: 10px;
`;

const commonIconStyles = css`
  font-size: 2rem;
  display: inline-block;
`;

const StyledWarningIcon = styled(IoWarningOutline)`
  ${commonIconStyles}
  font-size: 3rem;
`;
