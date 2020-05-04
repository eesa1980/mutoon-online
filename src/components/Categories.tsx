import { ButtonBase, Paper, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { navigate } from "gatsby";
import Img from "gatsby-image";
import startCase from "lodash-es/startCase";
import * as React from "react";
import styled from "styled-components";
import {
  AllWordpressCategory,
  AllWordpressWpMedia,
  CategoryEdge,
} from "../model";
import NotFoundPage from "../pages/404";
import { Hr } from "../styled/Hr";
import Select, { SelectOption } from "./../components/Select";

interface CategoriesProps {
  data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
  };
}

const PaperStyled = styled(Paper)`
  padding: 20px 40px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-flow: dense;
`;

const ButtonBaseStyled = styled(ButtonBase)`
  position: relative;
  width: 100%;
  height: 200px;

  &:hover {
    hr {
      width: 90px;
      padding: 0;
    }

    .gatsby-image-wrapper {
      opacity: 0.1;
    }
  }
`;

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

const TextStyled = styled(Typography)`
  position: relative;
  z-index: 1;
  padding: 20px;
`;

const HrStyled = styled(Hr)`
  margin-bottom: -20px;
`;

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
      <PaperStyled>
        <Typography variant="h4" component="h1" align="center">
          Select a Book
        </Typography>
        <Hr color={teal[300]} />
        <Select
          defaultValue={"all"}
          id={"categories"}
          title={"Category"}
          values={categories}
          handleChange={handleChange.category}
        />
      </PaperStyled>

      <Buttons>
        {books.map((item: SelectOption, i: number) => (
          <ButtonBaseStyled
            focusRipple
            onClick={() => navigate(item.value)}
            key={item.value}
            color={"primary"}
          >
            {imageUrl(item.text) && <ImageStyled fluid={imageUrl(item.text)} />}
            <TextStyled color="textPrimary" variant="h6">
              {startCase(item.text)}
              <HrStyled color={teal[300]} />
            </TextStyled>
          </ButtonBaseStyled>
        ))}
      </Buttons>
    </>
  );
};

export default Categories;
