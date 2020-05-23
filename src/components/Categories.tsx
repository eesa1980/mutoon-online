import {
  ButtonBase,
  MenuItem,
  Select,
  Typography,
  withTheme,
} from "@material-ui/core";
import { navigate } from "gatsby";
import Img from "gatsby-image";
import startCase from "lodash-es/startCase";
import * as React from "react";
import LazyLoad from "react-lazyload";
import styled from "styled-components";
import { AllCategory, CategoryNode } from "../model/category";
import NotFoundPage from "../pages/404";
import Hr from "../styled/Hr";

interface CategoriesProps {
  data: {
    allCategory: AllCategory;
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
  const [category, setCategory] = React.useState<string>("all");
  const { allCategory } = data;

  if (!allCategory) {
    return <NotFoundPage />;
  }

  const categories = React.useMemo(() => {
    const dropdowns = allCategory.nodes
      ?.filter(
        (node: CategoryNode) => node.slug !== "unassigned" && !node.parent_id
      )
      .map((item: CategoryNode) => ({
        value: item.id,
        text: item.name,
      }));

    dropdowns.unshift({
      value: "all",
      text: "All",
    });

    return dropdowns;
  }, [allCategory]);

  const result = React.useMemo(
    () =>
      allCategory.nodes?.filter((node: CategoryNode) => {
        if (node.parent_id) {
          if (category === "all") {
            return node.id;
          }

          return node.parent_id === category;
        }
      }),
    [category]
  );

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(e.target.value as string);
  };

  return (
    <>
      <Wrapper>
        <Typography color="textSecondary" component={"span"}>
          Categories:
        </Typography>

        <Select
          variant={"outlined"}
          defaultValue={"all"}
          id={"categories"}
          onChange={handleChange}
        >
          {categories.map((item, i: number) => (
            <MenuItem key={i} value={item.value}>
              {startCase(item.text)}
            </MenuItem>
          ))}
        </Select>
      </Wrapper>

      <Buttons>
        {result.map((item) => (
          <LazyLoad height={200} key={item.id}>
            <ButtonBaseStyled
              focusRipple
              onClick={() => navigate(item.slug)}
              color={"primary"}
            >
              {item.avatar?.childImageSharp && (
                <ImageStyled fluid={item.avatar?.childImageSharp?.fluid} />
              )}
              <TextStyled color="textPrimary" component="strong">
                {startCase(item.name)}
                <HrStyled className="hr" />
              </TextStyled>
              <br />
            </ButtonBaseStyled>
          </LazyLoad>
        ))}
      </Buttons>
    </>
  );
};

export default Categories;
