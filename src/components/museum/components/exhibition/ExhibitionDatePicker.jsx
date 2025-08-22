import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import chevronRight from '@/assets/user/chevron-right.svg';
import styles from './exhibitionDatePicker.module.css';

export default function ExhibitionDatePicker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  // URL 파라미터나 state에서 초기 날짜 가져오기
  useEffect(() => {
    if (location.state?.initialDates) {
      const { startDate, endDate } = location.state.initialDates;
      if (startDate) setSelectedStartDate(new Date(startDate));
      if (endDate) setSelectedEndDate(new Date(endDate));
    }
  }, [location.state]);

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 현재 월의 첫 번째 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // 현재 월의 총 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // 다음 월로 이동
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 날짜 선택 처리
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 등록일 기준 7일 뒤부터 선택 가능
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (clickedDate < minDate) {
      return; // 선택 불가능한 날짜
    }

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 시작일 선택 또는 재선택
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setIsSelectingEndDate(true);
    } else if (selectedStartDate && !selectedEndDate) {
      // 종료일 선택
      if (clickedDate >= selectedStartDate) {
        setSelectedEndDate(clickedDate);
        setIsSelectingEndDate(false);
      }
    }
  };

  // 날짜가 선택 가능한지 확인
  const isDateSelectable = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= minDate;
  };

  // 날짜가 선택된 시작일인지 확인
  const isStartDate = (day) => {
    if (!selectedStartDate) return false;
    return day === selectedStartDate.getDate() && 
           currentDate.getMonth() === selectedStartDate.getMonth() &&
           currentDate.getFullYear() === selectedStartDate.getFullYear();
  };

  // 날짜가 선택된 종료일인지 확인
  const isEndDate = (day) => {
    if (!selectedEndDate) return false;
    return day === selectedEndDate.getDate() && 
           currentDate.getMonth() === selectedEndDate.getMonth() &&
           currentDate.getFullYear() === selectedEndDate.getFullYear();
  };

  // 날짜가 선택 범위 내에 있는지 확인
  const isInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date > selectedStartDate && date < selectedEndDate;
  };

  // 선택된 기간의 총 일수 계산
  const getTotalDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 시작일과 종료일 포함
  };

  // 날짜 포맷팅
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

  // 캘린더 그리드 생성
  const generateCalendarDays = () => {
    const days = [];
    
    // 이전 월의 마지막 날들 (빈 칸 채우기)
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    
    // 현재 월의 날짜들
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

  // 뒤로가기 처리
  const handleBack = () => {
    navigate(-1);
  };

  // 완료 버튼 클릭 처리
  const handleComplete = () => {
    if (selectedStartDate && selectedEndDate) {
      // 전시 등록 페이지로 돌아가면서 선택된 날짜 전달
      navigate(-1, {
        state: {
          selectedDates: {
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            totalDays: getTotalDays()
          }
        }
      });
    }
  };

  // 완료 버튼 활성화 여부
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
