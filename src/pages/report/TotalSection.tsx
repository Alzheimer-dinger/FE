import styled from 'styled-components';
import { useMemo, useState, useEffect } from 'react';
import { BudgetLine } from '@components/index';
import {
  getPeriodAnalysis,
  getLatestReport,
  getUserProfile,
  getRelations,
} from '@services/api';
import { useLocation } from 'react-router-dom';

const TotalSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    '최근 1주일' | '최근 1달' | '사용자 설정'
  >('최근 1주일');
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<
    Array<{
      date: string;
      happyScore: number;
      sadScore: number;
      angryScore: number;
      surprisedScore: number;
      boredScore: number;
    }>
  >([]);
  const [totalParticipate, setTotalParticipate] = useState<number | null>(null);
  const [averageCallTime, setAverageCallTime] = useState<string | null>(null);
  const [latestReport, setLatestReport] = useState<{
    reportId: string;
    userId: string;
    createdAt: string;
    report: string;
  } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [patientName, setPatientName] = useState<string>('');

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const overrideUserId = query.get('userId') || '';
  const userName = query.get('userName') || '';

  const toDate = (value: string) => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(v => Number(v));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const formatYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const addMonths = (date: Date, months: number) => {
    const cloned = new Date(date.getTime());
    cloned.setMonth(cloned.getMonth() + months);
    return cloned;
  };

  const addDays = (date: Date, days: number) => {
    const cloned = new Date(date.getTime());
    cloned.setDate(cloned.getDate() + days);
    return cloned;
  };

  const maxEndForStart = useMemo(() => {
    const s = toDate(startDate);
    if (!s) return '';
    // 최대 1달까지 허용 (같은 일자 포함)
    return formatYMD(addMonths(s, 1));
  }, [startDate]);

  // 종료일 기준 최소 시작일(1달 전) 계산이 필요하면 주석 해제하여 사용
  // const minStartForEnd = useMemo(() => {
  //   const e = toDate(endDate);
  //   if (!e) return '';
  //   return formatYMD(addMonths(e, -1));
  // }, [endDate]);

  const isRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    const s = toDate(startDate)!;
    const e = toDate(endDate)!;
    if (e < s) return false;
    const maxAllowed = addMonths(s, 1);
    return e.getTime() <= maxAllowed.getTime();
  }, [startDate, endDate]);

  const daysDiffInclusive = (sStr: string, eStr: string) => {
    const s = toDate(sStr);
    const e = toDate(eStr);
    if (!s || !e) return 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const diff = Math.floor((e.getTime() - s.getTime()) / oneDayMs) + 1;
    return diff > 0 ? diff : 0;
  };

  const participationDisplay = useMemo(() => {
    if (totalParticipate === null) return '--회';
    let totalDays = daysDiffInclusive(startDate, endDate);
    if (selectedPeriod === '최근 1주일') totalDays = 7;
    if (selectedPeriod === '최근 1달') totalDays = 30;
    if (totalDays <= 0) return '--회';
    return `${totalParticipate}/${totalDays}회`;
  }, [totalParticipate, startDate, endDate, selectedPeriod]);

  const riskScore = useMemo(() => {
    if (totalParticipate === null || totalParticipate <= 0) return null;
    let totalDays = daysDiffInclusive(startDate, endDate);
    if (selectedPeriod === '최근 1주일') totalDays = 7;
    if (selectedPeriod === '최근 1달') totalDays = 30;
    if (totalDays <= 0) return null;
    return totalParticipate / totalDays;
  }, [totalParticipate, startDate, endDate, selectedPeriod]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as '최근 1주일' | '최근 1달' | '사용자 설정';
    setSelectedPeriod(value);
    if (value === '사용자 설정') {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    const today = new Date();
    if (value === '최근 1주일') {
      const s = addDays(today, -6);
      setStartDate(formatYMD(s));
      setEndDate(formatYMD(today));
      fetchPeriod(formatYMD(s), formatYMD(today));
    } else if (value === '최근 1달') {
      const s = addMonths(today, -1);
      setStartDate(formatYMD(s));
      setEndDate(formatYMD(today));
      fetchPeriod(formatYMD(s), formatYMD(today));
    }
  };

  const fetchPeriod = async (s: string, e: string) => {
    try {
      setLoading(true);
      setError(null);

      // overrideUserId가 없으면 현재 로그인한 사용자의 ID 사용
      let targetUserId = overrideUserId;
      if (!targetUserId) {
        try {
          const profile = await getUserProfile();
          targetUserId = profile.patientCode || profile.userId;
        } catch {
          setTimeline([]);
          setError('사용자 정보를 가져올 수 없습니다');
          return;
        }
      }

      if (!targetUserId) {
        setTimeline([]);
        setError('연결된 사용자가 없습니다');
        return;
      }

      const res = await getPeriodAnalysis(s, e, targetUserId);
      if (!res) {
        setTimeline([]);
        setTotalParticipate(null);
        setAverageCallTime(null);
        return;
      }
      setTimeline(res.emotionTimeline || []);
      setTotalParticipate(res.totalParticipate ?? null);
      setAverageCallTime(res.averageCallTime ?? null);

      // 기간 데이터 로딩 후 종합보고서도 함께 로딩
      fetchLatestReport(e, targetUserId);
    } catch (err: any) {
      setTimeline([]);
      setError(err?.message || '기간 데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestReport = async (periodEnd: string, userId: string) => {
    try {
      setReportLoading(true);
      const report = await getLatestReport(periodEnd, userId);
      setLatestReport(report);
    } catch (err: any) {
      console.error('종합보고서 로딩 실패:', err);
      setLatestReport(null);
    } finally {
      setReportLoading(false);
    }
  };

  // 초기 로딩 시 환자 이름과 종합보고서 가져오기
  useEffect(() => {
    const loadPatientInfo = async () => {
      if (overrideUserId) {
        try {
          const profile = await getUserProfile();
          if (
            profile.patientCode === overrideUserId ||
            profile.userId === overrideUserId
          ) {
            setPatientName(profile.name);
          } else {
            // 연결된 환자 정보 가져오기
            const relations = await getRelations();
            const patient = relations.find(
              (r: any) => r.patientCode === overrideUserId,
            );
            if (patient) {
              setPatientName(patient.name);
            } else {
              setPatientName('환자');
            }
          }
        } catch {
          setPatientName('환자');
        }
      } else if (userName) {
        // userName 파라미터가 있으면 사용 (본인 프로필 클릭 시)
        setPatientName(userName);
      } else {
        setPatientName('나');
      }
    };

    const loadReport = async () => {
      // 종합보고서 로딩 (overrideUserId가 없으면 현재 사용자 ID 사용)
      if (endDate) {
        let targetUserId = overrideUserId;
        if (!targetUserId) {
          try {
            const profile = await getUserProfile();
            targetUserId = profile.patientCode || profile.userId;
          } catch (err) {
            console.error('사용자 정보를 가져올 수 없습니다:', err);
          }
        }
        if (targetUserId) {
          fetchLatestReport(endDate, targetUserId);
        }
      }
    };

    loadPatientInfo();
    loadReport();
  }, [overrideUserId, endDate, userName]);

  const handleConfirm = () => {
    setShowCustom(false);
    if (startDate && endDate) {
      fetchPeriod(startDate, endDate);
    }
  };

  const handleCancel = () => {
    setShowCustom(false);
  };

  return (
    <TotalContent>
      <SectionTitle>{patientName}님의 종합 보고서</SectionTitle>
      <GraphSection>
        <GraphHeader>
          <SubTitle>감정 변화 그래프</SubTitle>
          <PeriodDropdown>
            <select value={selectedPeriod} onChange={handlePeriodChange}>
              <option value="최근 1주일">최근 1주일</option>
              <option value="최근 1달">최근 1달</option>
              <option value="사용자 설정">사용자 설정</option>
            </select>
          </PeriodDropdown>
        </GraphHeader>

        {showCustom && (
          <CustomRangePanel>
            <RangeRow>
              <label>시작일</label>
              <input
                type="date"
                value={startDate}
                max={endDate ? endDate : ''}
                onChange={e => {
                  const next = e.target.value;
                  setStartDate(next);
                  if (endDate && next) {
                    const s = toDate(next)!;
                    const eDate = toDate(endDate)!;
                    const maxAllowed = addMonths(s, 1);
                    // 종료일이 시작일 이전이면 종료일을 시작일로 보정
                    if (eDate < s) {
                      setEndDate(next);
                    } else if (eDate.getTime() > maxAllowed.getTime()) {
                      // 1달 초과 시 최대 허용일로 보정
                      setEndDate(formatYMD(maxAllowed));
                    }
                  }
                }}
              />
            </RangeRow>
            <RangeRow>
              <label>종료일</label>
              <input
                type="date"
                value={endDate}
                min={startDate ? startDate : ''}
                max={startDate ? maxEndForStart : ''}
                onChange={e => {
                  const next = e.target.value;
                  setEndDate(next);
                  if (startDate && next) {
                    const s = toDate(startDate)!;
                    const eDate = toDate(next)!;
                    const maxAllowed = addMonths(s, 1);
                    // 종료일이 시작일보다 이르면 시작일로 보정
                    if (eDate < s) {
                      setStartDate(next);
                    } else if (eDate.getTime() > maxAllowed.getTime()) {
                      // 1달 초과 선택 방지: 종료일을 최대 허용일로 보정
                      setEndDate(formatYMD(maxAllowed));
                    }
                  }
                }}
              />
            </RangeRow>
            <RangeHint>최대 1달까지 선택 가능합니다.</RangeHint>
            <Actions>
              <CancelBtn type="button" onClick={handleCancel}>
                취소
              </CancelBtn>
              <ConfirmBtn
                type="button"
                disabled={!isRangeValid}
                onClick={handleConfirm}
              >
                확인
              </ConfirmBtn>
            </Actions>
          </CustomRangePanel>
        )}

        {loading && <LoadingText>불러오는 중...</LoadingText>}
        {!loading && error && <ErrorText>{error}</ErrorText>}
        {!loading && !error && <BudgetLine data={timeline} />}
        <StatsRow>
          <StatCard>
            <StatLabel>통화 참여도</StatLabel>
            <StatValue>{participationDisplay}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>평균 통화 시간</StatLabel>
            <StatValue>{averageCallTime ?? '--'}</StatValue>
          </StatCard>
          {riskScore !== null && (
            <StatCard>
              <StatLabel>위험도 점수</StatLabel>
              <StatValue>{(riskScore * 100).toFixed(1)}%</StatValue>
            </StatCard>
          )}
        </StatsRow>
        {riskScore !== null && riskScore >= 0.3 && (
          <WarningBox>
            <b>⚠️ 경고</b>
            <br />
            인지 점수가 평균치보다 낮으니 가까운 병원에서 검사를 받아보시는 걸
            추천해요!
          </WarningBox>
        )}
      </GraphSection>
      <SectionTitle>종합 보고서</SectionTitle>
      {reportLoading ? (
        <LoadingText>리포트 불러오는 중...</LoadingText>
      ) : latestReport ? (
        <ResultBox>
          <ReportHeader>
            <ReportDate>{latestReport.createdAt} 생성</ReportDate>
            <ReportId>#{latestReport.reportId}</ReportId>
          </ReportHeader>
          <ReportContent>{latestReport.report}</ReportContent>
        </ResultBox>
      ) : (
        <ResultBox>해당 기간의 종합 보고서가 없습니다.</ResultBox>
      )}
    </TotalContent>
  );
};

export default TotalSection;

const TotalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 1rem 0 0.5rem 0;
`;

const GraphSection = styled.div`
  border: 1px solid #d7d7d7;
  border-radius: 12px;
  padding: 1rem;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const PeriodDropdown = styled.div`
  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background: white;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #856404;
`;

const ResultBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const CustomRangePanel = styled.div`
  margin: 0 0 12px 0;
  padding: 12px;
  border: 1px solid #e6e1ff;
  background: #faf9ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  label {
    width: 48px;
    font-size: 0.9rem;
    color: #555;
  }
  input[type='date'] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background: #fff;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ConfirmBtn = styled.button`
  background: #6c3cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled.button`
  background: #f3f3f3;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
`;

const RangeHint = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #7a7a7a;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 0.9rem;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ReportDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const ReportId = styled.span`
  font-size: 0.8rem;
  color: #6c3cff;
  font-weight: 600;
`;

const ReportContent = styled.div`
  font-size: 0.9rem;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap; /* 줄바꿈 및 공백 유지 */
  word-break: break-word; /* 단어 단위로 줄바꿈 */
`;
