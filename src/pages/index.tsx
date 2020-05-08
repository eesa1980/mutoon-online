import { Container, Paper, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/styles";
import * as React from "react";
import styled from "styled-components";
import Categories from "../components/Categories";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllWordpressCategory, AllWordpressWpBooks, Site } from "../model";
import { AllWordpressWpMedia } from "../model/media";
import Hr from "../styled/Hr";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
    allWordpressWpBooks: AllWordpressWpBooks;
    site: Site;
    file: any;
  };
}

const HeroWrapper = styled(Paper)`
  text-align: center;
  background-image: url(${({ src }: any) => src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${teal[800]};
    top: 0;
    left: 0;
    opacity: 0.5;
  }
`;

const Hero = styled.div`
  position: relative;
  z-index: 1;
`;

const Logo = withTheme(styled.div`
  height: 150px;

  img {
    padding: ${({ theme }) => theme.spacing(2)}px;
    height: inherit;
  }
`);

const Index: React.FC<IndexPageProps> = (props) => {
  const {
    file: logoImage,
    allWordpressCategory,
    allWordpressWpMedia,
    site,
  } = props.data;

  return (
    <DefaultLayout>
      <HeroWrapper
        src={
          "https://images.unsplash.com/photo-1584498570807-65de8dc95648?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1631&q=80"
        }
      >
        <Hero>
          <Logo>
            <img src={logoImage.publicURL} />
          </Logo>
        </Hero>
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
        <Categories data={{ allWordpressCategory, allWordpressWpMedia }} />
      </Container>
    </DefaultLayout>
  );
};

export const pageQuery = graphql`
  query IndexQuery {
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
    allWordpressCategory {
      edges {
        node {
          name
          wordpress_parent
          slug
          wordpress_id
        }
      }
    }
    allWordpressWpMedia(filter: { media_type: { eq: "image" } }) {
      nodes {
        media_type
        alt_text
        title
        categories {
          name
        }
        localFile {
          childImageSharp {
            id
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default Index;
