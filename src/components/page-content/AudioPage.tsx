import * as React from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { setPage, setStatus } from "../../redux/actions/audioActions";
import { State } from "../../redux/reducers";
import { LoadingStatus, Status } from "../../redux/reducers/audioReducer";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import Spinner from "../Spinner";
import { PageProps } from "./Page";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

interface AudioPageProps extends PageProps {
  audioState?: State["audio"];
  audioPlayer?: any;
  dispatch: Dispatch<any>;
}

const HashMarker = styled.span`
  position: absolute;
  margin-top: 100px;
`;

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const AudioPage: React.FC<AudioPageProps> = ({
  title,
  page,
  audioState,
  dispatch,
}) => {
  const Wrapper = getWrapper(page?.acf.page_number as number);

  const { page_number, arabic, english } = page.acf;

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
          dispatch(setPage(page_number as number));
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
        page_number={page_number as number}
        arabic={arabic}
        english={english}
      />
    </Wrapper>
  );
};

export default AudioPage;
