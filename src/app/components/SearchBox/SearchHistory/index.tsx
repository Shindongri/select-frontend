import React from 'react';

import { AppStatus } from 'app/services/app';
import { localStorageManager } from 'app/utils/search';

interface SearchHistoryProps {
  appStatus: AppStatus;
}

type KeywordList = string[] | null;

const HistoryInitialState = {
  enabled: true,
  bookKeywordList: [],
  articleKeywordList: [],
};

const SearchHistory: React.FunctionComponent<SearchHistoryProps> = (props: SearchHistoryProps) => {
  const { appStatus } = props;
  const [enableSave, setEnableSave] = React.useState(false);
  const [bookKeywordList, setBookKeywordList] = React.useState<KeywordList>(null);
  const [articleKeywordList, setArticleKeywordList] = React.useState<KeywordList>(null);

  React.useEffect(() => {
    const LocalStorageHistory = localStorageManager.load().history;
    setEnableSave(LocalStorageHistory.enabled || HistoryInitialState.enabled);
    setBookKeywordList(LocalStorageHistory.bookKeywordList || HistoryInitialState.bookKeywordList);
    setArticleKeywordList(
      LocalStorageHistory.articleKeywordList || HistoryInitialState.articleKeywordList,
    );
  }, []);

  const handleDeleteButtonClick = (targetIdx: number) => {
    const keywordList = appStatus === AppStatus.Books ? bookKeywordList : articleKeywordList;
    const filteredKeywordList = keywordList
      ? keywordList.filter((_, idx) => idx !== targetIdx)
      : [];
    if (appStatus === AppStatus.Books) {
      setBookKeywordList(filteredKeywordList);
    } else {
      setArticleKeywordList(filteredKeywordList);
    }
  };

  const clearKeywordList = () => {
    setBookKeywordList(HistoryInitialState.bookKeywordList);
    setArticleKeywordList(HistoryInitialState.articleKeywordList);
  };

  const handleSavingToggleButtonClick = () => {
    const enabled = !enableSave;
    setEnableSave(enabled);
    if (!enabled) {
      clearKeywordList();
    }
  };

  const renderKeywordList = () => {
    const keywordList = appStatus === AppStatus.Books ? bookKeywordList : articleKeywordList;
    if (!enableSave || !keywordList) {
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
        {enableSave && (
          <button type="button" onClick={clearKeywordList}>
            <span className="a11y">검색어 기록</span>전체 삭제
          </button>
        )}
        <button type="button" onClick={handleSavingToggleButtonClick}>
          검색어 저장 {enableSave ? '끄기' : '켜기'}
        </button>
      </div>
    </div>
  );
};

export default SearchHistory;
