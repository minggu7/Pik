import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestGiSang from './TestGiSang';
import KakaoMap from './KakaoMap'; // 새로운 컴포넌트 import

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/weather">
            <button className="weather-button">테스트페이지 기상청 API</button>
          </Link>
          <Link to="/map">
            <button className="map-button">카카오맵 보기</button>
          </Link>
          <Routes>
            <Route path="/weather" element={<TestGiSang />} />
            <Route path="/map" element={<KakaoMap />} /> {/* KakaoMap 경로 추가 */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
