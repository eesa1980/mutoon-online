import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import styled from "styled-components";

const Hr = styled.div`
  margin: ${({ theme }) => theme.spacing(2)}px auto;
  width: 100px;
  transition: all 0.2s;
  border-top: 1px solid ${teal[400]};
`;

export default withTheme(Hr);
