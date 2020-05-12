import { Typography } from "@material-ui/core";
import withTheme from "@material-ui/styles/withTheme";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import Hr from "../../styled/Hr";

export const Wrapper = withTheme(styled("div")`
  text-align: justify;
  margin: 0;
  padding: ${({ theme }) => {
    return theme.spacing(2) + "px " + theme.spacing(4) + "px";
  }};
  &.title {
    padding-left: 0;
    padding-right: 0;
  }
`);

const PageText: React.FC<{
  page_number: number;
  arabic: string;
  english: string;
  title: string;
}> = ({ page_number, arabic, english, title }) => (
  <Wrapper className={page_number === 0 && "title"}>
    {page_number === 0 && title && (
      <>
        <Typography variant="h5" component="h1" align="center">
          <p>{title}</p>
        </Typography>
        <Hr />{" "}
      </>
    )}
    <Typography component="span" variant="caption">
      {parse(arabic)}
    </Typography>
    {page_number > 0 && <Hr />}
    <Typography component="span">{parse(english)}</Typography>
  </Wrapper>
);

export default PageText;
