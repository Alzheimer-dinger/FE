/**
 * Search - 통화 기록 검색 화면
 *
 * 세부사항:
 * - SearchHeader 컴포넌트를 통해 검색어 입력 및 실행
 * - callRecordData를 대상으로 제목(title) 기준 필터링
 * - 검색 아이콘 클릭 전에는 아무 결과도 표시하지 않음
 * - 결과는 RecordCard 컴포넌트로 렌더링
 */

import { useState } from 'react';
import styled from 'styled-components';
import { SearchHeader, ContentContainer, RecordCard } from '@components/index';
import { callRecordData } from '@constants/dummy';

interface CallRecord {
  id: string;
  title: string;
  date: string;
  time: string;
}
const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState<CallRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return;

    const result = callRecordData.filter(record =>
      record.title.toLowerCase().includes(keyword),
    );
    setFiltered(result);
    setHasSearched(true);
  };

  return (
    <Container>
      <SearchHeader
        text={searchText}
        onTextChange={value => setSearchText(value)}
        onSearch={handleSearch}
      />
      <ContentContainer>
        {hasSearched && (
          <RecordList>
            {filtered.length > 0 ? (
              filtered.map(record => (
                <RecordCard
                  key={record.id}
                  title={record.title}
                  date={record.date}
                  time={record.time}
                />
              ))
            ) : (
              <Text>검색 결과가 없습니다.</Text>
            )}
          </RecordList>
        )}
      </ContentContainer>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-top: 2rem;
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
