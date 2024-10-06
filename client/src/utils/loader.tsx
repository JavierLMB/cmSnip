import styled, { keyframes } from "styled-components";

const Loader = () => {
  return (
    <LoaderContainer>
      <Boxes />
    </LoaderContainer>
  );
};

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const rotateAnimation = keyframes`
  0%, 50% {
    transform: rotate(0deg);
  }
  80%, 100% {
    transform: rotate(180deg);
  }
`;

const translateAnimation = keyframes`
  0% {
    transform: translate(0);
  }
  50%, 80% {
    transform: translate(calc(var(--s, 1) * 2.5px));
  }
  100% {
    transform: translate(0);
  }
`;

const LoaderContainer = styled.div`
  display: grid;
  place-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  z-index: 1000;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.dark};
  animation: ${fadeInAnimation} 1.5s;
`;

const Boxes = styled.div`
  display: inline-flex;
  gap: 5px;
  animation: ${rotateAnimation} 1s infinite;

  &::before,
  &::after {
    content: "";
    width: 35px;
    aspect-ratio: 1;
    box-shadow: 0 0 0 3px inset ${({ theme }) => theme.colors.basic.white};
    animation: ${translateAnimation} 1s infinite;
    border-radius: 4px;
  }

  &::after {
    --s: -1;
  }
`;

export default Loader;
