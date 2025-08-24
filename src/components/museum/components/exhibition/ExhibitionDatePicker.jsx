import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import chevronRight from '@/assets/user/chevron-right.svg';
import styles from './exhibitionDatePicker.module.css';

export default function ExhibitionDatePicker() {
  const navigate = useNavigate();
  const location = useLocation();

  // 업로드 페이지에서 넘어온 draft/initialDates/returnTo
  const draft = location.state?.draft;
  const returnTo = location.state?.returnTo || -1;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  // URL state에서 초기 날짜 가져오기
  useEffect(() => {
    if (location.state?.initialDates) {
      const { startDate, endDate } = location.state.initialDates;
      if (startDate) setSelectedStartDate(new Date(startDate));
      if (endDate) setSelectedEndDate(new Date(endDate));
    }
  }, [location.state]);

  // 현재 월 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 날짜 선택 처리
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 뒤부터
    if (clickedDate < minDate) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setIsSelectingEndDate(true);
    } else if (selectedStartDate && !selectedEndDate) {
      if (clickedDate >= selectedStartDate) {
        setSelectedEndDate(clickedDate);
        setIsSelectingEndDate(false);
      }
    }
  };

  const isDateSelectable = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= minDate;
  };

  const isStartDate = (day) => {
    if (!selectedStartDate) return false;
    return (
      day === selectedStartDate.getDate() &&
      currentDate.getMonth() === selectedStartDate.getMonth() &&
      currentDate.getFullYear() === selectedStartDate.getFullYear()
    );
  };

  const isEndDate = (day) => {
    if (!selectedEndDate) return false;
    return (
      day === selectedEndDate.getDate() &&
      currentDate.getMonth() === selectedEndDate.getMonth() &&
      currentDate.getFullYear() === selectedEndDate.getFullYear()
    );
  };

  const isInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date > selectedStartDate && date < selectedEndDate;
  };

  const getTotalDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 시작일과 종료일 포함
    // (선택된 시작/종료일이 동일하면 1일)
  };

  const formatDate = (date) => {
    if (!date) return '';
    return (
      <span className={styles.dateText}>
        <span>
          <span className={styles.dateNumber}>{date.getFullYear()}</span>
          <span className={styles.dateUnit}>년</span>
        </span>
        <span>
          <span className={styles.dateNumber}>{date.getMonth() + 1}</span>
          <span className={styles.dateUnit}>월</span>
        </span>
        <span>
          <span className={styles.dateNumber}>{date.getDate()}</span>
          <span className={styles.dateUnit}>일</span>
        </span>
      </span>
    );
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectable = isDateSelectable(day);
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      const inRange = isInRange(day);

      let dayClass = styles.day;
      if (!isSelectable) dayClass += ` ${styles.disabledDay}`;
      if (isStart) dayClass += ` ${styles.startDate}`;
      if (isEnd) dayClass += ` ${styles.endDate}`;
      if (inRange) dayClass += ` ${styles.inRange}`;

      days.push(
        <div
          key={day}
          className={dayClass}
          onClick={() => isSelectable && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const handleBack = () => {
    // 뒤로 가되, draft를 유지하고 싶으면 state로 넘겨줌
    navigate(-1, {
      state: {
        draft
      }
    });
  };

  const handleComplete = () => {
    if (selectedStartDate && selectedEndDate) {
      // 로컬 시간 기준으로 YYYY-MM-DD 형식 변환 (UTC 시간대 문제 해결)
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const startDateString = formatDate(selectedStartDate);
      const endDateString = formatDate(selectedEndDate);
      
      // draft에 날짜 데이터를 YYYY-MM-DD 형식으로 추가
      const updatedDraft = {
        ...draft,
        startDate: startDateString,
        endDate: endDateString,
        totalDays: getTotalDays()
      };
      
      console.log('ExhibitionDatePicker - 날짜 데이터가 포함된 draft:', updatedDraft);
      console.log('변환된 날짜:', { startDate: startDateString, endDate: endDateString });
      
      // 업로드 페이지로 돌아가면서 선택된 날짜 + draft 같이 전달
      // 업로드 페이지에서 location.state.selectedDates & .draft를 사용해 복원
      if (returnTo === 'exhibition-upload') {
        navigate('/exhibition/upload', {
          state: {
            selectedDates: {
              startDate: startDateString,
              endDate: endDateString,
              totalDays: getTotalDays()
            },
            draft: updatedDraft
          }
        });
      } else {
        // returnTo 정보가 없을 때는 업로드 경로를 직접 지정해도 됨
        navigate('/exhibition/upload', {
          replace: true,
          state: {
            selectedDates: {
              startDate: startDateString,
              endDate: endDateString,
              totalDays: getTotalDays()
            },
            draft: updatedDraft
          }
        });
      }
    }
  };

  const isCompleteButtonActive = selectedStartDate && selectedEndDate;

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>

      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img 
                src={chevronLeft} 
                alt="back" 
                className={`${styles.backIcon}`} 
              />
            </button>
            <h1 className={styles.title}>기간 설정하기</h1>
          </div>
        </div>

        {/* 캘린더 */}
        <div className={styles.calendarContainer}>
          {/* 월 네비게이션 */}
          <div className={styles.monthNavigation}>
            <button className={styles.monthButton} onClick={goToPreviousMonth}>
              <img 
                src={chevronRight} 
                alt="이전 월" 
                className={`${styles.monthIcon} ${styles.rotate180}`} 
              />
            </button>
            <span className={styles.currentMonth}>
              {currentDate.getMonth() + 1}월
            </span>
            <button className={styles.monthButton} onClick={goToNextMonth}>
              <img src={chevronRight} alt="다음 월" className={styles.monthIcon} />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className={styles.weekDays}>
            <div className={styles.weekDay}>일</div>
            <div className={styles.weekDay}>월</div>
            <div className={styles.weekDay}>화</div>
            <div className={styles.weekDay}>수</div>
            <div className={styles.weekDay}>목</div>
            <div className={styles.weekDay}>금</div>
            <div className={styles.weekDay}>토</div>
          </div>

          {/* 날짜 그리드 */}
          <div className={styles.daysGrid}>
            {generateCalendarDays()}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className={styles.infoMessage}>
          전시 시작일은 등록일 기준 7일 뒤부터 설정 가능합니다
        </div>

        {/* 선택된 기간 정보 */}
        <div className={styles.dateInfo}>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>전시 시작일</span>
            <span className={styles.dateValue}>
              {selectedStartDate ? formatDate(selectedStartDate) : ''}
            </span>
          </div>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>전시 종료일</span>
            <span className={styles.dateValue}>
              {selectedEndDate ? formatDate(selectedEndDate) : ''}
            </span>
          </div>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>
              총 <span className={styles.dateNumber}>{getTotalDays()}</span> <span className={styles.dateUnit}>일</span>
            </span>
          </div>
        </div>

        {/* 완료 버튼 */}
        <button
          className={`${styles.completeButton} ${!isCompleteButtonActive ? styles.disabled : ''}`}
          onClick={handleComplete}
          disabled={!isCompleteButtonActive}
        >
          등록 완료하기
        </button>
      </div>
    </div>
  );
}
