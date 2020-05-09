import { Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import Hr from "../styled/Hr";
import { PaperStyled, PaperStyledTitle } from "../styled/PaperStyled";

const PageText = withTheme(styled("div")`
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

const PageNumber = withTheme(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${teal[400]};
  border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`);

interface PageProps {
  index: number;
  title?: string;
  arabic: any;
  english: any;
}

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const BookPage: React.FC<PageProps> = ({ index, title, arabic, english }) => {
  const Wrapper = getWrapper(index);

  return (
    <Wrapper elevation={1} variant="outlined">
      {index > 0 && (
        <PageNumber>
          <Typography variant="body1" component="strong" align="center">
            {index}
          </Typography>
        </PageNumber>
      )}
      <PageText className={index === 0 && "title"}>
        {index === 0 && title && (
          <>
            <Typography variant="h5" component="h1" align="center">
              <p>{title}</p>
            </Typography>
            <Hr />{" "}
          </>
        )}
        <Typography component="span" variant={"caption"}>
          {parse(arabic)}
        </Typography>
        {index > 0 && <Hr />}
        <Typography component="span">{parse(english)}</Typography>
      </PageText>
    </Wrapper>
  );
};

export default BookPage;
