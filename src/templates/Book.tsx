import { Container, Paper, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import parse from "html-react-parser";
import * as React from "react";
import { Fragment } from "react";
import LazyLoad from "react-lazyload";
import styled from "styled-components";
import DefaultLayout from "../layouts/DefaultLayout";
import { Page } from "../model";
import { Hr } from "../styled/Hr";

interface IBookTemplate {
  pageContext: {
    title: string;
    book: Page[];
  };
  [key: string]: any;
}

const Content = styled(Paper)`
  padding: 20px 40px;
  margin-block-start: 1rem;
  margin-block-end: 1rem;

  p {
    display: block;
    margin-block-start: 1rem;
    margin-block-end: 1rem;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
`;

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => (
          <Fragment key={i}>
            <LazyLoad height={200}>
              <Content elevation={1} variant="outlined">
                {i === 0 && (
                  <>
                    <Typography variant="h4" component="h1" align="center">
                      <p>{pageContext.title}</p>
                    </Typography>
                    <Hr color={teal[300]} />
                  </>
                )}
                <Typography component="span" variant={"caption"}>
                  {parse(page?.acf?.arabic)}
                </Typography>
                <Hr color={teal[300]} />
                <Typography component="span">
                  {parse(page?.acf?.english)}
                </Typography>
              </Content>
            </LazyLoad>
          </Fragment>
        ))}
      </Container>
    </DefaultLayout>
  );
};

export default BookTemplate;
