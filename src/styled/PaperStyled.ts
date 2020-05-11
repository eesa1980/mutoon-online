import Paper from "@material-ui/core/Paper";
import withTheme from "@material-ui/core/styles/withTheme";
import styled from "styled-components";

export const PaperStyled = withTheme(styled(Paper)`
  position: relative;
  display: block;
  margin: ${({ theme }) => theme.spacing(2)}px 0;
  padding-top: ${({ theme }) => theme.spacing(4)}px;
  overflow: hidden;
`);

export const PaperStyledTitle = withTheme(styled(Paper)`
  position: relative;
  display: block;
  margin: 0;
  background: none;
  border: 0;
  overflow: hidden;
`);
