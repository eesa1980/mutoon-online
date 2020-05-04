import { Container } from "@material-ui/core";
import * as React from "react";
import Categories from "../components/Categories";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllWordpressCategory, Site } from "../model";
import { AllWordpressWpMedia } from "../model/media";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
    site: Site;
  };
}

const Index: React.FC<IndexPageProps> = (props) => {
  const { site, ...categoriesData } = props.data;

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        <Categories data={{ ...categoriesData }} />
      </Container>
    </DefaultLayout>
  );
};

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
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
