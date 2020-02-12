import React from 'react';

import { AppStatus } from 'app/services/app';
import { localStorageManager } from 'app/utils/search';

interface SearchHistoryProps {
  appStatus: AppStatus;
}

interface History {
  enabled: null | boolean;
  bookKeywordList: string[];
  articleKeywordList: string[];
}

const keywordListInitialState = {
  bookKeywordList: [],
  articleKeywordList: [],
};

const SearchHistory: React.FunctionComponent<SearchHistoryProps> = (props: SearchHistoryProps) => {
  const { appStatus } = props;
  const [history, setHistory] = React.useState<History>({
    enabled: null,
    ...keywordListInitialState,
  });

  React.useEffect(() => {
    const {
      enabled = true,
      bookKeywordList = [],
      articleKeywordList = [],
    } = localStorageManager.load().history;
    setHistory({
      enabled,
      bookKeywordList,
      articleKeywordList,
    });
  }, []);

  const updateHistory = (newHistory: History) => {
    setHistory(newHistory);
    // update local storage
  };

  const handleDeleteButtonClick = (targetIdx: number) => {
    const keywordList =
      appStatus === AppStatus.Books ? history.bookKeywordList : history.articleKeywordList;
    const filteredKeywordList = keywordList
      ? keywordList.filter((_, idx) => idx !== targetIdx)
      : [];
    const newHistory = {
      ...history,
      [appStatus === AppStatus.Books
        ? 'bookKeywordList'
        : 'articleKeywordList']: filteredKeywordList,
    };
    updateHistory(newHistory);
  };

  const handleClearButtonClick = () => {
    const newHistory = {
      enabled: true,
      ...keywordListInitialState,
    };
    updateHistory(newHistory);
  };

  const handleSavingToggleButtonClick = () => {
    const newHistory = {
      enabled: !history.enabled,
      ...keywordListInitialState,
    };
    updateHistory(newHistory);
  };

  const renderKeywordList = () => {
    const { enabled, bookKeywordList, articleKeywordList } = history;
    const keywordList = appStatus === AppStatus.Books ? bookKeywordList : articleKeywordList;
    if (!enabled || !keywordList) {
      return null;
    }
    if (keywordList.length === 0) {
      return '없어용';
    }
    return keywordList.map((keyword, idx) => (
      <li key={`keywordList_${appStatus}_${idx}`}>
        {keyword}
        <button
          type="button"
          onClick={() => {
            handleDeleteButtonClick(idx);
          }}
        >
          키워드 삭제
        </button>
      </li>
    ));
  };

  return (
    <div>
      검색 히스토리
      {renderKeywordList()}
      <div>
        {history.enabled && (
          <button type="button" onClick={handleClearButtonClick}>
            <span className="a11y">검색어 기록</span>전체 삭제
          </button>
        )}
        <button type="button" onClick={handleSavingToggleButtonClick}>
          검색어 저장 {history.enabled ? '끄기' : '켜기'}
        </button>
      </div>
    </div>
  );
};

export default SearchHistory;
