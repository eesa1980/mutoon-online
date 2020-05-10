import { Button, ButtonGroup, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Howler } from "howler";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import { Page } from "../model/";
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
  togglePlayback?: any;
  playing?: boolean;
  toggleLooping?: any;
  looping?: boolean;
}

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const howler: any = Howler;

const BookPage: React.FC<PageProps> = ({
  title,
  page,
  togglePlayback,
  playing,
  toggleLooping,
  looping,
}) => {
  const Wrapper = getWrapper(page?.acf.page_number);

  const { page_number, arabic, english, audio: url } = page.acf;

  const activeAudio = React.useMemo(() => {
    return howler._howls[howler?._howls.length - 1]?._src;
  }, [howler?._howls.length]);

  return (
    <Wrapper elevation={1} variant="outlined">
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
      {togglePlayback && toggleLooping && page_number > 0 && (
        <ButtonGroup
          size="large"
          variant="text"
          color="primary"
          aria-label="contained primary button group"
          fullWidth={true}
        >
          <Button
            onClick={() => {
              togglePlayback(url.localFile.publicURL);
            }}
          >
            {playing && activeAudio === url.localFile.publicURL ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </Button>
          <Button
            hidden={true}
            onClick={() => {
              toggleLooping();
            }}
          >
            {looping ? <>Play once</> : <LoopIcon />}
          </Button>
        </ButtonGroup>
      )}
    </Wrapper>
  );
};

export default BookPage;
