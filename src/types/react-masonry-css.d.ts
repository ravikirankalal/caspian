/// <reference types="react" />

declare module 'react-masonry-css' {
  import * as React from 'react';

  export interface MasonryProps {
    breakpointCols?: number | { default: number, [key: number]: number } | { [key: number]: number };
    columnClassName?: string;
    className: string;
  }

  class Masonry extends React.Component<MasonryProps & React.HTMLProps<HTMLElement>, any> {
    render(): React.ReactElement;
  }

  export default Masonry;
}
