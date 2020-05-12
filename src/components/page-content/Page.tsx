import * as React from "react";
import { BookPage } from "../../model";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

export interface PageProps {
  page: BookPage;
  title?: string;
  id?: string;
}

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const Page: React.FC<PageProps> = ({ title, page, id }) => {
  const Wrapper = getWrapper(page?.acf.page_number as number);

  const { page_number, arabic, english } = page.acf;

  return (
    <Wrapper id={id} elevation={page_number > 1 ? 3 : 0}>
      {page_number > 0 && <PageNumber page_number={page_number as number} />}
      <PageText
        title={title}
        page_number={page_number as number}
        arabic={arabic}
        english={english}
      />
    </Wrapper>
  );
};

export default Page;
