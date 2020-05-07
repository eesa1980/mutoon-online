import { Typography } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import Hr from "../styled/Hr";
import PaperStyled from "../styled/PaperStyled";

const Text = withTheme(styled("div")`
  text-align: justify;
  margin: 0;
  padding: ${({ theme }) => {
    return theme.spacing(2) + "px " + theme.spacing(4) + "px";
  }};
  &.title {
    text-align-last: center;
  }
`);

interface PageProps {
  index: number;
  title?: string;
  arabic: any;
  english: any;
}

const BookPage: React.FC<PageProps> = ({ index, title, arabic, english }) => {
  return (
    <PaperStyled elevation={1} variant="outlined">
      <Text className={index === 0 && "title"}>
        {index === 0 && title && (
          <>
            <Typography variant="h5" component="h1" align="center">
              <p>{title}</p>
            </Typography>
          </>
        )}
        <Typography component="span" variant={"caption"}>
          {parse(arabic)}
        </Typography>
        {index > 0 && <Hr />}
        <Typography component="span">{parse(english)}</Typography>
      </Text>
    </PaperStyled>
  );
};

export default BookPage;
