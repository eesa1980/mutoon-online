import { Container, Paper, Typography } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
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

const PaperStyled = withTheme(styled(Paper)`
  display: block;
  margin: ${({ theme }) => theme.spacing(2)}px 0;
`);

const Text = withTheme(styled("div")`
  text-align: justify;
  margin: 0;
  padding: ${({ theme }) => theme.spacing(2)}px
    ${({ theme }) => theme.spacing(4)}px;

  &.title {
    text-align: center;
  }

  p {
    text-align: inherit;
    display: block;
    margin-block-start: ${({ theme }) => theme.spacing(2)}px;
    margin-block-end: ${({ theme }) => theme.spacing(2)}px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
`);

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => (
          <Fragment key={i}>
            <LazyLoad height={200}>
              <PaperStyled elevation={1} variant="outlined">
                <Text className={i === 0 && "title"}>
                  {i === 0 && (
                    <>
                      <Typography variant="h4" component="h1" align="center">
                        <p>{pageContext.title}</p>
                      </Typography>
                    </>
                  )}
                  <Typography component="span" variant={"caption"}>
                    {parse(page?.acf?.arabic)}
                  </Typography>
                  {i > 0 && <Hr />}
                  <Typography component="span">
                    {parse(page?.acf?.english)}
                  </Typography>
                </Text>
              </PaperStyled>
            </LazyLoad>
          </Fragment>
        ))}
      </Container>
    </DefaultLayout>
  );
};

export default BookTemplate;
