import * as React from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { Content } from "../../model/book";
import { setPage, setStatus } from "../../redux/actions/audioActions";
import { State } from "../../redux/reducers";
import { LoadingStatus, Status } from "../../redux/reducers/audioReducer";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import Spinner from "../Spinner";
import { PageProps } from "./Page";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

interface AudioPageProps extends PageProps {
  title: string;
  page_number: number;
  content: Content;
  audioState?: State["audio"];
  dispatch: Dispatch<any>;
}

const HashMarker = styled.span`
  position: absolute;
  margin-top: -110px;
`;

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const AudioPage: React.FC<AudioPageProps> = ({
  title,
  page_number,
  content,
  audioState,
  dispatch,
}) => {
  const Wrapper = getWrapper(page_number);

  return (
    <Wrapper
      elevation={page_number > 1 ? 3 : 0}
      disabled={page_number === audioState.page}
      style={{
        opacity: page_number === audioState.page ? 1 : page_number > 0 && 0.5,
        cursor: "pointer",
      }}
      onClick={() => {
        if (page_number > 0) {
          dispatch(setPage(page_number));
          dispatch(setStatus(Status.STOPPED));
        }
      }}
    >
      <HashMarker id={`page-${page_number}`} />
      {audioState.loadingStatus === LoadingStatus.LOADING &&
        page_number === audioState.page && <Spinner />}
      {page_number > 0 && <PageNumber page_number={page_number as number} />}
      <PageText
        title={title}
        page_number={page_number}
        arabic={content.ar}
        english={content.en}
      />
    </Wrapper>
  );
};

export default AudioPage;
