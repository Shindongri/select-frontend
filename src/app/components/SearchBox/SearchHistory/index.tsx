import React from 'react';

import { AppStatus } from 'app/services/app';
import { localStorageManager } from 'app/utils/search';

interface SearchHistoryProps {
  appStatus: AppStatus;
}

type KeywordList = string[] | null;

const SearchHistory: React.FunctionComponent<SearchHistoryProps> = (props: SearchHistoryProps) => {
  const { appStatus } = props;
  const [keywordList, setKeywordList] = React.useState<KeywordList>(null);

  React.useEffect(() => {
    const {
      enabled = true,
      bookKeywordList = [],
      articleKeywordList = [],
    } = localStorageManager.load().history;
    setKeywordList(appStatus === AppStatus.Books ? bookKeywordList : articleKeywordList);
  }, []);

  const renderKeywordList = () => {
    if (!keywordList) return null;
    if (keywordList.length === 0) {
      return '없어용';
    }
    return keywordList.map((keyword, idx) => (
      <li key={`keywordList_${appStatus}_${idx}`}>{keyword}</li>
    ));
  };

  return (
    <div>
      검색 히스토리
      {renderKeywordList()}
    </div>
  );
};

export default SearchHistory;
