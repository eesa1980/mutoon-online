/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IndexQuery
// ====================================================

export interface IndexQuery_site_siteMetadata {
  __typename: "SiteSiteMetadata";
  title: string | null;
}

export interface IndexQuery_site {
  __typename: "Site";
  siteMetadata: IndexQuery_site_siteMetadata | null;
}

export interface IndexQuery {
  site: IndexQuery_site | null;
}
