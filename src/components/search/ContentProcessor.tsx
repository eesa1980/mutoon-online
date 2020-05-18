import { escapeRegExp } from "lodash-es";
import { compose } from "redux";
import { BookNode, Content } from "../../model/book";
import {
  addHighlighting,
  stripHtml,
  stripTashkeel,
} from "../../util/stringModifiers";

export function ContentProcessor(searchVal: string) {
  let count = 0;

  // Regex for search match
  const re = new RegExp(escapeRegExp(searchVal), "i");

  /**
   * Add a page number field to obj
   *
   * @param {Content} con
   * @param {number} i
   */
  const addPageField = (con: Content, i: number) => {
    con.page_number = i;
    return con;
  };

  /**
   * Remove all pages that don't match search field
   *
   * @param {Content} content
   */
  const findMatches = ({ en, ar }: Content) => {
    const english = compose(stripHtml)(en);
    const arabic = compose(stripHtml, stripTashkeel)(ar);

    return re.test(`${english} ${arabic}`) && searchVal;
  };

  /**
   * Highlights word matches ready to be displayed in accordion
   *
   * @param {BookNode} book
   * @returns {Content}
   */
  const processAccordionData = (book: BookNode) => (con: Content) => {
    let { en, ar } = con;

    const enRes = addHighlighting(en, searchVal);
    const arRes = addHighlighting(stripTashkeel(ar), searchVal);

    if (searchVal && book.content) {
      en = enRes.result;
      ar = arRes.result;

      count += enRes.count || arRes.count;
    }

    return { en, ar, page_number: con.page_number };
  };

  /**
   * Processes all the content, depending on serach results
   *
   * @param {BookNode} book
   */
  const processContent = (book: BookNode) => {
    count = 0;

    book.content = book.content
      .map(addPageField)
      .filter(findMatches)
      .map(processAccordionData(book));

    return {
      book,
      count,
    };
  };

  return { processContent };
}
