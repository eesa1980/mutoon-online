import { escapeRegExp } from "lodash-es";
import { compose } from "redux";
import { BookNode, Content } from "../../model/book";
import {
  addHighlighting,
  stripHtml,
  stripTashkeel,
} from "../../util/stringModifiers";

const addPageNumber = (con: Content, i: number) => {
  con.page_number = i;
  return con;
};

export function SearchHelper(searchVal: string) {
  /**
   * adds page numbers to non mutated data, then filters out non matches
   *
   * @param {BookNode} item
   */
  const processContent = (item: BookNode) => {
    const re = new RegExp(escapeRegExp(searchVal), "i");

    // Add correct page number to content as we lose this with filtering
    // then filter out non-matching results
    item.content = item.content
      .map(addPageNumber)
      .filter(({ en, ar }: Content) => {
        const english = compose(stripHtml)(en);
        const arabic = compose(stripHtml, stripTashkeel)(ar);

        return re.test(`${english} ${arabic}`) && searchVal;
      });

    return item;
  };

  /**
   * Highlights matches and gathers totals, ready for data ready to be displayed in accordian
   *
   * @param {BookNode} item
   */
  const processAccordionData = (item: BookNode) => {
    let count = 0;

    const { content, ...others } = item;

    return {
      book: {
        ...others,
        content: item.content.map(({ en, ar, page_number }: Content) => {
          const enRes = addHighlighting(en, searchVal);
          const arRes = addHighlighting(stripTashkeel(ar), searchVal);

          if (searchVal && item.content) {
            en = enRes.result;
            ar = arRes.result;

            count += enRes.count || arRes.count;
          }

          return { en, ar, page_number };
        }),
      },
      count,
    };
  };

  return {
    process: {
      content: processContent,
      accordionData: processAccordionData,
    },
  };
}
