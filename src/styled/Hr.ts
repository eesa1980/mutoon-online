import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import styled from "styled-components";

export const Hr = withTheme(styled.div`
  margin: ${({ theme }) => theme.spacing(3)}px auto;
  width: 100px;
  transition: all 0.2s;
  border-top: 2px solid ${teal[400]};
`);
