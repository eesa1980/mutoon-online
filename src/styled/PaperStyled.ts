import Paper from "@material-ui/core/Paper";
import withTheme from "@material-ui/core/styles/withTheme";
import styled from "styled-components";

const PaperStyled = styled(Paper)`
  display: block;
  margin: ${({ theme }) => theme.spacing(2)}px 0;
`;

export default withTheme(PaperStyled);
