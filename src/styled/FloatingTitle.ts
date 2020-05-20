import { Container, ThemeOptions, withTheme } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import styled, { css } from "styled-components";

export const FloatingTitle = withTheme(styled(Container)`
  ${(props: { theme: ThemeOptions }) =>
    css`
      left: 0;
      width: 100%;
      padding-top: 4px;
      padding-bottom: 4px;
      /* box-shadow: ${props.theme.shadows[5]}; */
      position: sticky;
      opacity: 1;
      z-index: ${props.theme.zIndex.appBar};
      background: ${teal[700]};
      top: 56px;
      @media screen and (min-width: ${props.theme.breakpoints.values.sm}px) {
        top: 64px;
      }

      > * {
        display: flex;
        align-items: center;
        justify-content: left;
      }
    `}
`);
