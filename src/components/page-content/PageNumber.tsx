import { Typography, withTheme } from "@material-ui/core";
import * as React from "react";
import { teal } from "@material-ui/core/colors";
import styled from "styled-components";

export const Wrapper = withTheme(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: ${({ theme }) => {
    return theme.spacing(3) + "px " + theme.spacing(4) + "px";
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${teal[400]};
  border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`);

const PageNumber: React.FC<{ page_number: number }> = ({ page_number }) => (
  <Wrapper>
    <Typography variant="body1" component="strong" align="center">
      Page {page_number}
      &nbsp; &nbsp;
    </Typography>
  </Wrapper>
);

export default PageNumber;
