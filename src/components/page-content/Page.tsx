import * as React from "react";
import { Content } from "../../model/book";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

export interface PageProps {
  content: Content;
  title?: string;
  id?: string;
  page_number: number;
}

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const Page: React.FC<PageProps> = ({ page_number: pageNumber, id, title, content }) => {
  const Wrapper = getWrapper(pageNumber as number);

  return (
    <Wrapper id={id} elevation={pageNumber > 1 ? 3 : 0}>
      {pageNumber > 0 && <PageNumber page_number={pageNumber as number} />}
      <PageText
        title={title}
        page_number={pageNumber}
        arabic={content.ar}
        english={content.en}
      />
    </Wrapper>
  );
};

export default Page;
