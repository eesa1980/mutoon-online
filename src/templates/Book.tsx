import { Container } from "@material-ui/core";
import * as React from "react";
import { Fragment } from "react";
import BookPage from "../components/BookPage";
import { useAudio } from "../hooks/useAudio";
import DefaultLayout from "../layouts/DefaultLayout";
import { Page } from "../model";

interface IBookTemplate {
  pageContext: {
    title: string;
    book: Page[];
  };
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const { playing, togglePlayback, toggleLooping, looping } = useAudio();

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => {
          return (
            <Fragment key={i}>
              <BookPage
                page={page}
                title={pageContext.title}
                togglePlayback={togglePlayback}
                playing={playing}
                toggleLooping={toggleLooping}
                looping={looping}
              />
            </Fragment>
          );
        })}
      </Container>
    </DefaultLayout>
  );
};

export default BookTemplate;
