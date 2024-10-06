import { useMediaQuery } from "react-responsive";

const useMediaQueries = () => {
  const isMax1000px = useMediaQuery({ maxWidth: 1100 });
  const isMax800px = useMediaQuery({ maxWidth: 800 });
  const isMax650px = useMediaQuery({ maxWidth: 650 });

  return { isMax1000px, isMax800px, isMax650px };
};

export default useMediaQueries;
