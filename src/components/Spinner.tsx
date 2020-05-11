import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = () => {
  const [show, set] = useState(false);

  useEffect(() => {
    const to = setTimeout(() => set(true), 300);

    return () => {
      clearTimeout(to);
    };
  }, []);

  if (!show) {
    return <></>;
  }

  return (
    <Wrapper>
      <CircularProgress size={70} />
    </Wrapper>
  );
};

export default Spinner;
