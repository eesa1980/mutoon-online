import { CircularProgress, ThemeOptions } from "@material-ui/core";
import * as React from "react";
import styled, { css } from "styled-components";

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

const Spinner: React.FC<{ fullscreen?: boolean }> = ({
  fullscreen = false,
}) => {
  const [show, set] = React.useState(false);

  React.useEffect(() => {
    const to = setTimeout(() => set(true), 500);

    return () => {
      clearTimeout(to);
    };
  }, []);

  if (!show) {
    return <></>;
  }

  return (
    <Fullscreen data-fullscreen={fullscreen}>
      <Wrapper>
        <CircularProgress size={70} />
      </Wrapper>
    </Fullscreen>
  );
};

export default Spinner;

const Fullscreen = styled.div`
  ${(props: { theme: ThemeOptions; [key: string]: any }) => {
    return (
      !!props["data-fullscreen"] &&
      css`
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 99999;
        background: #000000;
      `
    );
  }}
`;
