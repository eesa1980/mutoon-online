import {
  ButtonBase,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { navigate } from "gatsby";
import * as React from "react";
import { useDispatch } from "react-redux";
import { BookEdge } from "../../model";
import { setPage } from "../../redux/actions/audioActions";
import Page from "./Page";

const Content = ({
  edges,
  setSearchVal,
}: {
  edges: BookEdge[];
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const dispatch = useDispatch();

  return (
    <>
      {edges.map((edge) => {
        const { acf } = edge.node;

        return (
          <ButtonBase
            onClick={() => {
              setSearchVal("");
              dispatch(setPage(acf.page_number as number));
              navigate(
                `${edge.node.categories[0].slug}#page-${acf.page_number}`
              );
            }}
            key={`${acf.book_title}-${acf.page_number}`}
            title={`Go to page ${acf.page_number} of ${acf.book_title}`}
          >
            {acf.page_number > 0 ? (
              <Page
                page={edge.node}
                title={acf.book_title}
                id={`page-${acf.page_number}`}
              />
            ) : (
              <></>
            )}
          </ButtonBase>
        );
      })}
    </>
  );
};

const Title = ({ title, count }: { title: string; count: number }) => (
  <Typography component="div" variant="h6" color="textSecondary">
    {title}:&nbsp;
    <Typography component="strong" variant="h6" color="textPrimary">
      {count}&nbsp;
    </Typography>
  </Typography>
);

const SearchAccordion: React.FC<{
  book: {
    title: string;
    edges: BookEdge[];
    count: number;
  };
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
}> = ({ book, setSearchVal }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Title title={book.title} count={book.count} />
    </ExpansionPanelSummary>
    <ExpansionPanelDetails style={{ display: "block" }}>
      <Content edges={book.edges} setSearchVal={setSearchVal} />
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default SearchAccordion;
