import { ButtonBase, Typography, withTheme } from "@material-ui/core";
import { navigate } from "gatsby";
import Img from "gatsby-image";
import startCase from "lodash-es/startCase";
import * as React from "react";
import LazyLoad from "react-lazyload";
import styled from "styled-components";
import {
  AllWordpressCategory,
  AllWordpressWpMedia,
  CategoryEdge,
} from "../model";
import NotFoundPage from "../pages/404";
import Hr from "../styled/Hr";
import Select, { SelectOption } from "./../components/Select";

interface CategoriesProps {
  data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
  };
}

const Wrapper = withTheme(styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;

  > :first-child {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }

  > :last-child {
    margin-bottom: 0px;
  }
`);

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-flow: dense;
`;

const ButtonBaseStyled = withTheme(styled(ButtonBase)`
  position: relative;
  width: 100%;
  height: 200px;

  &:hover {
    .hr {
      width: 90px;
      padding: 0;
    }

    .gatsby-image-wrapper {
      opacity: 0.1;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }
`);

const ImageStyled = styled(Img)`
  width: 100%;
  height: 200px;
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 0;
  opacity: 0.3;
  transition: all 0.2s;
`;

const TextStyled = withTheme(styled(Typography)`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing(4)}px;
`);

const HrStyled = withTheme(styled(Hr)`
  margin-bottom: -${({ theme }) => theme.spacing(1)}px;
`);

const Categories: React.FC<CategoriesProps> = ({ data }) => {
  const [category, setCategory] = React.useState<number>(undefined);
  const { allWordpressCategory, allWordpressWpMedia } = data;

  if (!allWordpressCategory) {
    return <NotFoundPage />;
  }

  const categories: SelectOption[] = React.useMemo(() => {
    const result = allWordpressCategory.edges
      ?.filter(
        (edge: CategoryEdge) =>
          edge.node.slug !== "unassigned" && !edge.node.wordpress_parent
      )
      .map((edge: any) => ({
        value: edge.node.wordpress_id,
        text: edge.node.name,
      }));

    result.unshift({
      value: "all",
      text: "All",
    });

    return result;
  }, [allWordpressCategory]);

  const books: SelectOption[] = React.useMemo(
    () =>
      allWordpressCategory.edges
        ?.filter((edge: CategoryEdge) => {
          if (category) {
            return edge.node.wordpress_parent === category;
          }

          return edge.node.wordpress_parent;
        })
        .map((edge: CategoryEdge) => ({
          value: edge.node.slug,
          text: edge.node.name,
        })),
    [category]
  );

  const handleChange = {
    category: (value: string) => {
      setCategory(Number.parseInt(value, 10));
    },
  };

  const imageUrl = (cat: string): any => {
    return allWordpressWpMedia.nodes.find((img: any) => {
      return startCase(cat) === startCase(img.categories[0].name);
    }).localFile.childImageSharp.fluid;
  };

  return (
    <>
      <Wrapper>
        <Typography color="textSecondary" component={"span"}>
          Categories:
        </Typography>
        <Select
          selectProps={{
            variant: "outlined",
          }}
          defaultValue={"all"}
          id={"categories"}
          values={categories}
          handleChange={handleChange.category}
        />
      </Wrapper>

      <Buttons>
        {books.map((item: SelectOption) => (
          <LazyLoad height={200} key={item.value}>
            <ButtonBaseStyled
              focusRipple
              onClick={() => navigate(item.value)}
              color={"primary"}
            >
              {imageUrl(item.text) && (
                <ImageStyled fluid={imageUrl(item.text)} />
              )}
              <TextStyled color="textPrimary" variant="h6">
                {startCase(item.text)}
                <HrStyled className="hr" />
              </TextStyled>
            </ButtonBaseStyled>
          </LazyLoad>
        ))}
      </Buttons>
    </>
  );
};

export default Categories;
