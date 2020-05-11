import { Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import parse from "html-react-parser";
import * as React from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { Page } from "../model/";
import { setPage, setPlayType } from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import { PlayType } from "../redux/reducers/audioReducer";
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
  padding: ${({ theme }) => {
    return theme.spacing(3) + "px " + theme.spacing(4) + "px";
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${teal[400]};
  border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`);

interface PageProps {
  page: Page;
  title?: string;
  audioState?: State["audio"];
  audioPlayer?: any;
  dispatch: Dispatch<any>;
}

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const BookPage: React.FC<PageProps> = ({
  title,
  page,
  audioPlayer,
  audioState,
  dispatch,
}) => {
  const Wrapper = getWrapper(page?.acf.page_number);

  const { page_number, arabic, english } = page.acf;

  return (
    <Wrapper
    id={`page-${page_number}`}
      elevation={page_number > 1 ? 3 : 0}
      disabled={page_number === audioState.page}
      style={{
        opacity: page_number === audioState.page ? 1 : page_number > 0 && 0.5,
        cursor: "pointer",
      }}
      onClick={() => {
        if (page_number > 0) {
          dispatch(setPage(page_number));

          if (audioState.playType === PlayType.CONTINUOUS) {
            dispatch(setPlayType(PlayType.CONTINUOUS_PAUSED));
          }
        }
      }}
    >
      {page_number > 0 && (
        <PageNumber>
          <Typography variant="body1" component="strong" align="center">
            Page {page_number}
          </Typography>
        </PageNumber>
      )}
      <PageText className={page_number === 0 && "title"}>
        {page_number === 0 && title && (
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
        {page_number > 0 && <Hr />}
        <Typography component="span">{parse(english)}</Typography>
      </PageText>
    </Wrapper>
  );
};

export default BookPage;
