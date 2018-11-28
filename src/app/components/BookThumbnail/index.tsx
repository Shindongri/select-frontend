import * as React from 'react';

import { DEFAULT_THUMBNAIL_SIZE, ThumbnailSize} from 'app/components/BookThumbnail/types';
import { LazyloadWrapper } from 'app/components/BookThumbnail/LazyloadWrapper';
import { SizeWrapper } from 'app/components/BookThumbnail/SizeWrapper';
import { LinkWrapper } from 'app/components/BookThumbnail/LinkWrapper';
import { CoverImage } from 'app/components/BookThumbnail/CoverImage';

export interface BookThumbnailProps {
  sizeWrapperClassName?: string;
  linkWrapperClassName?: string;
  imageClassName?: string;
  imageUrl: string;
  width?: ThumbnailSize;
  bookTitle: string;
  linkUrl?: string;
  linkType?: 'a' | 'Link' | 'button';
  onLinkClick?: (event: React.SyntheticEvent<any>) => void;
  shadow?: boolean;
  lazyload?: boolean;
  hasOverflowWrapper?: boolean;
  placeholder?: JSX.Element;
};

export const BookThumbnail: React.SFC<BookThumbnailProps> = (props) => {
  const {
    sizeWrapperClassName,
    linkWrapperClassName,
    imageClassName,
    imageUrl,
    width = DEFAULT_THUMBNAIL_SIZE,
    bookTitle,
    linkUrl,
    linkType = 'Link',
    onLinkClick = () => {},
    shadow = true,
    lazyload = true,
    hasOverflowWrapper = false,
    placeholder,
  } = props;

  return (
    <SizeWrapper
      className={sizeWrapperClassName}
      width={width}
    >
      <LinkWrapper
        className={linkWrapperClassName}
        linkUrl={linkUrl}
        linkType={linkType}
        onClick={onLinkClick}
      >
        <LazyloadWrapper
          width={width}
          lazyload={lazyload}
          placeholder={placeholder}
          hasOverflowWrapper={hasOverflowWrapper}
        >
          <CoverImage
            className={imageClassName}
            src={imageUrl}
            alt={bookTitle}
            shadow={shadow}
          />
        </LazyloadWrapper>
      </LinkWrapper>
    </SizeWrapper>
  )
}

export * from './CoverImage';
export * from './DefaultLazyloadPlaceholder';
export * from './helpers';
export * from './LazyloadWrapper';
export * from './LinkWrapper';
export * from './SizeWrapper';
export * from './types';