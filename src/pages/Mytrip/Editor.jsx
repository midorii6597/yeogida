import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import YesNoModal from '../../components/YesNoModal';
import Map from '../../components/Map'
import { createItineraries } from '../../api/Mytrip/Itineraries';
import { usePlaces } from './PlaceContext';
import { useAuth } from '../../context/AuthContext';

const ButtonContainer = styled.div`
    display: flex;
    max-width: 1400px;
    justify-content: right;
    flex-shrink: 0;
    margin: 150px auto 0px; /* 좌우 가운데 정렬을 위해 margin을 사용 */
`;

const NavButton = styled.button`
    display: flex;
    width: 80px;
    height: 36px;
    margin: 0 5px 5px 0;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    background: #F6F6F6;
    color: #000;
    font-family: NanumGothic;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    border: none;
    &:hover {
        background-color: #000;
        color: #FFF;
    }
`;

// 상단의 썸네일, 제목, 날짜를 포함하는 컨테이너
const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 400px;
  background-image: ${({ thumbnail }) => `url(${thumbnail})`};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin: 0 auto; /* 좌우 가운데 정렬을 위해 margin을 사용 */

  overflow: hidden; /* 오버레이가 컨테이너를 벗어나지 않도록 */

  /* 오버레이를 추가하여 투명도 조절 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2); /* 원하는 투명도 값으로 설정 */
    z-index: 1; /* 텍스트와 같은 컨텐츠보다 아래에 위치 */
  }

  /* 오버레이 위에 텍스트가 위치하도록 */
  > * {
    position: relative;
    z-index: 2;
  }
`;

const Title = styled.h1`
  font-family: NanumGothic;
  font-size: 60px;
  font-weight: bold;
  color: #fff;
  margin: 80px 0 60px 0;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const EditButton = styled.button`
    display: flex;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
    height: 35px;
    background-color: transparent;
    border: none;
    justify-content: right;
    align-items: center;
    flex-shrink: 0;
`;

const UserId = styled.h3`
  font-family: NanumGothic;
  font-size: 18px;
  color: #fff;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const DateRange = styled.h3`
  font-family: NanumGothic;
  font-size: 20px;
  color: #fff;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const MapContainer = styled.div`
  max-width: 950px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;  /* 탭과 콘텐츠를 세로로 배치 */
  border: 1px solid #ddd;
  width: 450px;
  margin: 20px auto;
  background-color: #EEF5FF;
`;

const DayTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E0E0E0;
  width: 450px;
  margin: 10px auto;
  margin-bottom: 20px;
`;

const DayTab = styled.div`
  flex-shrink: 0;  /* 탭이 축소되지 않도록 설정 */
  padding: 10px 20px 20px;
  font-size: 20px;
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  color: ${(props) => (props.isSelected ? '#59ABE6' : '#888')};
  cursor: pointer;
  border-bottom: ${(props) => (props.isSelected ? '3px solid #59ABE6' : '1px solid transparent')};
  white-space: nowrap;
  text-align: center;  /* 텍스트를 중앙 정렬 */
  font-family: NanumGothic;
`;

const Content = styled.div`
  padding: 20px;
  font-family: NanumGothic;
`;

// 지도와 탭 들어있는 부분
const EditorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
`;

export default function Editor({ onChange = () => { } }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { 제목: title = '', 기간: dateRange = '', 썸네일: initialThumbnail = '', value = [], 여행지: destinationArray = [], 상세내용: description = '' } = location.state || {};
  const [thumbnail, setThumbnail] = useState(initialThumbnail); // 초기 썸네일 파일 객체
  const [thumbnailPreview, setThumbnailPreview] = useState(initialThumbnail ? URL.createObjectURL(initialThumbnail) : null); // 미리보기용 URL

  const { places } = usePlaces();
  const [dayLocations, setDayLocations] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [days, setDays] = useState([]);

  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태 추가
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지

  const [itineraryId, setItineraryId] = useState(0);  // itinerary_id 상태
  const { user } = useAuth(); // AuthContext에서 user 객체 가져오기
  const userId = user?.id; // user 객체에서 id 추출

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(' ~ ').map(date => new Date(date.replace(/\//g, '-')));
      const dayCount = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
      const dayTabs = Array.from({ length: dayCount }, (_, i) => `DAY ${i + 1}`);
      setDays(dayTabs);
    }
  }, [dateRange]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align', 'color', 'background',
  ];

  const handleContentChange = (content) => {
    const newContent = [...value];
    newContent[currentDay - 1] = content;
    onChange(newContent);
  };

  const handleCancelClick = () => {
    setModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setModalOpen(false); // 모달 닫기
  };

  // 장소를 현재 DAY에 추가하는 함수
  const handleAddLocation = (location) => {
    setDayLocations((prev) => {
      const updated = { ...prev };
      const dayKey = `DAY ${activeTab + 1}`;
      if (!updated[dayKey]) updated[dayKey] = []; // DAY가 비어있다면 초기화
      updated[dayKey] = [...updated[dayKey], location]; // 현재 DAY에 장소 추가
      return updated;
    });
  };

  // 구현 예정
  const handleEditClick = () => {
    
  }

  const handleTabClick = (index) => {
    setActiveTab(index);
    setCurrentDay(index + 1);
  };

  const submitTravelPlan = async (requestData) => {
    try {
        const formData = new FormData();

        // FormData에 데이터 추가
        formData.append('itinerary_id', requestData.itinerary_id);
        formData.append('user_id', requestData.user_id);
        formData.append('title', requestData.title);
        formData.append('startdate', requestData.startdate);
        formData.append('enddate', requestData.enddate);
        formData.append('destination', requestData.destination);
        formData.append('public_private', requestData.public_private);
        formData.append('likenumber', requestData.likenumber);
        formData.append('description', requestData.description);
        formData.append('created_at', requestData.created_at);
        formData.append('updated_at', requestData.updated_at);

        // FormData에 파일 추가
        if (requestData.thumbnail) {
            formData.append('thumbnail', requestData.thumbnail);
        }

        // 여행 일정 생성 API 호출
        const result = await createItineraries(formData);
        console.log('여행 일정 생성 완료:', result);

        // 성공 시 리다이렉트
        navigate('/mytrip');
    } catch (error) {
        console.error('네트워크 오류 발생:', error);
        setModalMessage(`여행 일정 등록에 실패했습니다: ${error.message}`);
    }
  };

  const handleSaveClick = async (e) => {
      e.preventDefault();

      const requestData = {
          itinerary_id: itineraryId,
          user_id: userId,
          title,
          startdate: dateRange.split(' ~ ')[0],
          enddate: dateRange.split(' ~ ')[1],
          destination: destinationArray.join(', '),
          public_private: true,
          thumbnail, // 파일 객체
          likenumber: 0,
          description: value[currentDay - 1] || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
      };

      await submitTravelPlan(requestData);
      setItineraryId(prevId => prevId + 1);
  };

  return (
    <div>
      <ButtonContainer>
        <NavButton onClick={handleCancelClick}>취소하기</NavButton>
        <NavButton onClick={handleSaveClick}>저장하기</NavButton>
      </ButtonContainer>

      {/* 취소하기 모달창 */}
      <YesNoModal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        title="작성을 취소하시겠습니까?"
        bodyText="작성 중이던 내용이 모두 삭제됩니다."
        navigateTo="/mytrip"
      >
      </YesNoModal>

      {/* 썸네일, 제목, 날짜를 표시하는 상단 영역 */}
      <HeaderContainer thumbnail={thumbnailPreview}>
        <EditButton onClick={handleEditClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
            <path d="M28.2916 10.7046L24.2958 6.70874C23.7743 6.21888 23.0909 5.9378 22.3756 5.91898C21.6604 5.90016 20.9632 6.1449 20.4166 6.60665L7.29161 19.7317C6.82023 20.207 6.52672 20.8301 6.46036 21.4962L5.83328 27.5775C5.81363 27.7911 5.84135 28.0064 5.91445 28.2081C5.98755 28.4097 6.10424 28.5928 6.25619 28.7442C6.39246 28.8793 6.55407 28.9862 6.73175 29.0588C6.90943 29.1314 7.09968 29.1682 7.29161 29.1671H7.42286L13.5041 28.6129C14.1703 28.5465 14.7933 28.253 15.2687 27.7817L28.3937 14.6567C28.9031 14.1185 29.1784 13.4003 29.1593 12.6595C29.1402 11.9187 28.8281 11.2157 28.2916 10.7046V10.7046ZM23.3333 15.5754L19.4249 11.6671L22.2687 8.7504L26.2499 12.7317L23.3333 15.5754Z" fill="white" />
          </svg>
        </EditButton>
        <Title>{title}</Title>
        <UserId>{userId}</UserId>
        <DateRange>{formatDate(dateRange.split(' ~ ')[0])} ~ {formatDate(dateRange.split(' ~ ')[1])}</DateRange>
      </HeaderContainer>

      <EditorContainer>
        <MapContainer>
        <Map
          days={days}
          activeDay={activeTab}
          setActiveDay={setActiveTab}
          onAddLocation={handleAddLocation} // 장소 추가 콜백 전달
        />
        </MapContainer>

        <TabContainer>
          <DayTabs>
            {/* Swiper 컴포넌트를 사용하여 탭을 스와이프 가능하게 만들기 */}
            <Swiper
              spaceBetween={0} // 슬라이드 간 간격을 0으로 설정하여 탭들이 붙어서 보이게 함
              slidesPerView={3} // 한 화면에 3개의 탭을 보여줌
              onSlideChange={(swiper) => setActiveTab(swiper.realIndex)} // 슬라이드가 변경될 때 activeTab 업데이트
              loop={false} // loop 활성화로 무한 스와이프를 방지
            >
              {days.map((day, index) => (
                <SwiperSlide key={index}>
                  <DayTab
                    isSelected={activeTab === index}
                    onClick={() => handleTabClick(index)}>
                    {day}
                  </DayTab>
                </SwiperSlide>
              ))}
            </Swiper>
          </DayTabs>
          {/* 콘텐츠 부분 */}
          <Content>
            <h3>{`DAY ${activeTab + 1} Locations`}</h3>
            <ul>
              {(dayLocations[`DAY ${activeTab + 1}`] || []).map((location, idx) => (
                <li key={idx}>{location.name}</li>
              ))}
            </ul>
          </Content>
        </TabContainer>
      </EditorContainer>

      {/* Quill 에디터 */}
      <ReactQuill
          style={{ width: "1400px", height: "500px", margin: "0 auto 150px"}}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value[currentDay - 1] || ''}
          onChange={handleContentChange}
        />
    </div>
  );
}