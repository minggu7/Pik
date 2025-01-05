import { useEffect, useState } from 'react';
import './KakaoMap.css'; // 스타일을 외부 CSS 파일로 지정
import MOUNTAIN_DATA from '../src/data/mountainData'; // 산 데이터 import

function KakaoMap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [isToggleListOpen, setIsToggleListOpen] = useState(false); // 토글 상태 관리

  const new_script = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.addEventListener('load', () => {
        resolve();
      });
      script.addEventListener('error', (e) => {
        reject(e);
      });
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const my_script = new_script('https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=550770fa304faa4bc3ead92f0b1038d9');
    my_script.then(() => {
      const kakao = window['kakao'];
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.56000302825312, 126.97540593203321),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, options);

        // 산 정보로 마커 생성
        MOUNTAIN_DATA.forEach((mountain) => {
          const markerPosition = new kakao.maps.LatLng(mountain.lat, mountain.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // 스타일링된 InfoWindow 콘텐츠 (이미지 및 설명 추가)
          const infowindowContent = `
  <div style="padding:10px; border-radius:5px; background-color:#fff; border:1px solid #ddd; width:200px;">
    <h4 style="font-size:16px; margin:0; color: black;">${mountain.name}</h4>  <!-- 텍스트 색상 변경 -->
    <img src="${mountain.image}" alt="${mountain.name}" style="width:100%; height:auto; margin:10px 0; border-radius:5px;">
    <p style="font-size:14px; margin:5px 0; color: black;">${mountain.description}</p>  <!-- 텍스트 색상 변경 -->
    <p style="font-size:12px; color:gray;">높이: ${mountain.height}</p>
    <p style="font-size:12px; color:gray;">위치: (${mountain.lat}, ${mountain.lng})</p>
  </div>
`;

          // InfoWindow 생성
          const infowindow = new kakao.maps.InfoWindow({
            content: infowindowContent,
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
            setSelectedMountain(mountain); // 마커 클릭 시 해당 산으로 선택
          });
        });

        // 선택된 산으로 이동하는 함수
        if (selectedMountain) {
          const { lat, lng } = selectedMountain;
          const position = new kakao.maps.LatLng(lat, lng);
          map.setCenter(position);
          map.setLevel(6); // 줌 레벨 설정
        }
      });
    });
  }, [selectedMountain]); // selectedMountain이 변경될 때마다 맵 업데이트

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectMountain = (mountain) => {
    setSelectedMountain(mountain); // 토글 클릭 시 해당 산으로 위치 이동
  };

  // 검색어와 일치하는 산 필터링
  const filteredMountains = MOUNTAIN_DATA.filter((mountain) =>
    mountain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="kakao-map-container">
      <h2>Kakao Map</h2>

      {/* 검색창과 "산 목록" 토글 버튼 */}
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="산 이름을 검색하세요"
          className="search-input"
        />
        {/* "산 목록" 토글 버튼 */}
        <button
          onClick={() => setIsToggleListOpen(!isToggleListOpen)} // 토글 상태 변경
          className="toggle-button"
        >
          산 목록
        </button>
      </div>

      {/* "산 목록" 토글 목록 */}
      {isToggleListOpen && (
        <div className="toggle-list">
          {MOUNTAIN_DATA.map((mountain) => (
            <div
              key={mountain.name}
              onClick={() => handleSelectMountain(mountain)}
              className="toggle-item"
            >
              {mountain.name} ({mountain.height})
            </div>
          ))}
        </div>
      )}

      {/* 검색 결과 리스트 */}
      {searchTerm && filteredMountains.length > 0 && (
        <div className="search-results">
          {filteredMountains.map((mountain) => (
            <div
              key={mountain.name}
              onClick={() => handleSelectMountain(mountain)}
              className="search-item"
            >
              {mountain.name} ({mountain.height})
            </div>
          ))}
        </div>
      )}

      {/* 선택된 산 정보 표시 */}
      <div className="toggle-list">
        {selectedMountain ? (
          <div className="toggle-item">
            <span>{selectedMountain.name} 위치로 이동</span>
            <button onClick={() => setSelectedMountain(null)}>초기화</button>
          </div>
        ) : (
          <p>산을 선택하세요.</p>
        )}
      </div>

      {/* 지도 영역 */}
      <div id="map" className="map"></div>
    </div>
  );
}

export default KakaoMap;
