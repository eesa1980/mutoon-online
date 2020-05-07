import { Container } from "@material-ui/core";
import * as React from "react";
import { Fragment } from "react";
import BookPage from "../components/BookPage";
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
  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => (
          <Fragment key={i}>
            <BookPage
              index={i}
              title={pageContext.title}
              arabic={page?.acf?.arabic}
              english={page?.acf?.english}
            />
          </Fragment>
        ))}
      </Container>
    </DefaultLayout>
  );
};

export default BookTemplate;
