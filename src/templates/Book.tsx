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
  console.log("page?.acf?.page_number :>> ", pageContext?.book[10]);

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => (
          <Fragment key={i}>
            <BookPage
              index={page?.acf?.page_number}
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
