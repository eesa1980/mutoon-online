import { Container, Paper, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/styles";
import { graphql } from "gatsby";
import GatsbyImage from "gatsby-image";
import * as React from "react";
import styled from "styled-components";
import Categories from "../components/Categories";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllCategory, Site } from "../model";
import { Fluid } from "../model/image";
import Hr from "../styled/Hr";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    allCategory: AllCategory;
    imageSharp: {
      fluid: Fluid;
    };
    site: Site;
    file: any;
  };
}

const HeroWrapper = styled(Paper)`
  position: relative;
  position: relative;
  z-index: 1;
`;

const HeroImage = styled(GatsbyImage)`
  position: absolute !important;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 0;

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${teal[800]};
    top: 0;
    left: 0;
    opacity: 0.75;
  }
`;

const Logo = withTheme(styled.div`
  height: 150px;
  position: relative;
  width: 100%;

  img {
    padding: ${({ theme }) => theme.spacing(2)}px;
    height: inherit;
    margin: auto;
    display: block;
  }
`);

const Index: React.FC<IndexPageProps> = (props) => {
  const {
    file: logoImage,
    allCategory,
    site,
    imageSharp: heroImage,
  } = props.data;

  return (
    <>
      <DefaultLayout>
        <HeroWrapper>
          {heroImage && <HeroImage fluid={heroImage.fluid} />}
          {logoImage && (
            <Logo>
              <img src={logoImage.publicURL} />
            </Logo>
          )}
        </HeroWrapper>
        <Container maxWidth="xs">
          <Typography
            component="h1"
            variant="h4"
            color="textPrimary"
            align="center"
          >
            <p>{site.siteMetadata.title}</p>
          </Typography>
          <Hr />
          <Typography
            component="h2"
            variant="body1"
            color="textSecondary"
            align="center"
          >
            <p>{site.siteMetadata.description}</p>
          </Typography>
        </Container>
        <Container maxWidth="sm">
          <Categories data={{ allCategory }} />
        </Container>
      </DefaultLayout>
    </>
  );
};

export const pageQuery = graphql`
  query MemorisationPageQuery {
    site {
      siteMetadata {
        title
        description
        url
      }
    }
    file(relativePath: { eq: "logo.svg" }) {
      publicURL
    }
    allCategory {
      nodes {
        id
        avatar {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
        description
        name
        parent_id
        slug
      }
    }
    imageSharp(fluid: { originalName: { eq: "hero.jpg" } }) {
      fluid {
        ...GatsbyImageSharpFluid_noBase64
      }
    }
  }
`;

export default Index;
