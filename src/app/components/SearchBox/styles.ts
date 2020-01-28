import { css } from '@emotion/core';

export const searchIcon = css`
  width: 20px;
  height: 20px;
  fill: blue;
`;

export const searchInputWrapper = (isActive: boolean) => css`
  display: ${isActive ? 'block' : 'none'};
`;

export const backIcon = css`
  width: 20px;
  height: 20px;
  fill: green;
`;

export const searchInput = css`
  border: 1px solid red;
`;

export const clearIcon = css`
  width: 20px;
  height: 20px;
  fill: pink;
`;

