import Gallery3D from './components/Gallery3D';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  // URL 파라미터에서 전시 ID를 가져오거나 기본값 사용
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitionId = urlParams.get('exhibitionId') || '1';
  
  console.log('🚀 App 컴포넌트 렌더링');
  console.log('🔍 URL 파라미터:', window.location.search);
  console.log('🎯 전시 ID:', exhibitionId);

  return (
    <ErrorBoundary>
      <Gallery3D exhibitionId={exhibitionId} />
    </ErrorBoundary>
  );
}

export default App;