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
import { BookNode } from "../../model/book";
import { setPage } from "../../redux/actions/audioActions";
import Page from "./Page";

const Content = ({ book }: { book: BookNode }) => {
  const dispatch = useDispatch();

  return (
    <>
      {book.content.map((content, i) => {
        return (
          <ButtonBase
            onClick={() => {
              dispatch(setPage(content.page_number));
              navigate(`${book.slug}#page-${content.page_number}`);
            }}
            key={`${book.title}-${i}`}
            title={`Go to page ${content.page_number} of ${book.title}`}
          >
            {content.page_number ? (
              <Page
                page_number={content.page_number}
                content={content}
                title={book.title}
                id={`page-${content.page_number}`}
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
  result: {
    book: BookNode;
    count: number;
  };
}> = ({ result }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel-content"
      id="panel-header"
    >
      <Title title={result.book.title} count={result.count} />
    </ExpansionPanelSummary>
    <ExpansionPanelDetails style={{ display: "block" }}>
      <Content book={result.book} />
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default SearchAccordion;
