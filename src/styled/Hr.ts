import { withTheme } from "@material-ui/core/styles";
import styled from "styled-components";

export const Hr = withTheme(styled.hr`
  margin: ${({ theme }) => theme.spacing(3)}px auto;
  width: 100px;
  transition: all 0.2s;
`);
