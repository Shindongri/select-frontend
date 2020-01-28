import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useStore, useDispatch } from 'react-redux';

import history from 'app/config/history';
import { AppStatus } from 'app/services/app';
import { getAppStatus } from 'app/services/app/selectors';
import { getGnbSearchActiveType, getSolidBackgroundColorRGBString, selectGnbColorLevel } from 'app/services/commonUI/selectors';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { useLocation } from 'react-router-dom';
import { GNBSearchActiveType } from 'app/services/commonUI';
import BackIcon from 'svgs/ArrowLeftLine.svg';
import ClearIcon from 'svgs/Close.svg';
import SearchIcon from 'svgs/Search.svg';
import IOSSearchIcon from 'svgs/IOSSearch.svg';

import * as styles from './styles';
import { searchActions } from 'app/services/search';

const SearchBox: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const gnbColorLevel = useSelector(selectGnbColorLevel);
  const solidBackgroundColorRGBString = useSelector(getSolidBackgroundColorRGBString);
  const gnbSearchActiveType = useSelector(getGnbSearchActiveType);
  const isIosInApp = useSelector(getIsIosInApp);
  const isInApp = useSelector(selectIsInApp);
  const appStatus = useSelector(getAppStatus);
  const { search: searchQuery } = useLocation();

  const searchInputEl = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [keyword, setKeyword] = useState('');

  const isActiveTypeBlock = gnbSearchActiveType === GNBSearchActiveType.block;
  const isAppStatusBooks = appStatus === AppStatus.Books;
  const isClearButtonVisible = keyword.length > 0;

  useEffect(() => {
    if (isActive && searchInputEl.current) searchInputEl.current.focus();
  }, [isActive]);

  const handleActivateButtonClick = () => {
    setIsActive(true);
  };

  const handleBackButtonClick = () => {
    if(isActiveTypeBlock) history.goBack();
    setIsActive(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value: keyword} = e.target;
    setKeyword(keyword);
    dispatch(searchActions.changeKeyword(keyword));
  };

  const handleInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    // console.log(keyword);
    // console.log(keyCode);
  };

  const handleKeywordClearButtonClick = () => {
    setKeyword('');
  };

  return (
    <div>
      <button type="button" onClick={handleActivateButtonClick}>
        {isIosInApp ? <IOSSearchIcon css={styles.searchIcon}/> : <SearchIcon css={styles.searchIcon}/>}
        <span className="a11y">검색 모드 활성화</span>
      </button>
      <div css={styles.searchInputWrapper(isActive)}>
        <button type="button" onClick={handleBackButtonClick}>
          <BackIcon css={styles.backIcon} />
          <span className="a11y">검색 취소</span>
        </button>
        <input
          css={styles.searchInput}
          type="search"
          role="search"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          ref={searchInputEl}
          placeholder={`${isAppStatusBooks ? '도서' : '아티클'} 검색`}
          value={keyword}
          onChange={handleInputChange}
          onKeyUp={handleInputKeyUp}
          maxLength={150}
        />
        {isClearButtonVisible && (
          <button type="button" onClick={handleKeywordClearButtonClick}>
            <ClearIcon css={styles.clearIcon}/>
            <span className="a11y">검색어 지우기</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
