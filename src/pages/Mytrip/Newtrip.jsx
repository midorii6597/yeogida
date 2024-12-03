import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DateInput from '../../components/DateInput';
import TagInput from '../../components/TagInput';
import DropdownTagInput from '../../components/DropdownTagInput';
import CommonModal from '../../components/CommonModal';
import { getFriendList } from '../../api/Mypage/friendAPI';

const NewTripContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
`;

const NewTripForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 30px;
`;

const FormLabel = styled.label`
    width: 100%;
    line-height: 21px;
    font-family: NanumGothic;
    color: #000;
    display: flex;
    align-items: center;
    margin-left: 5px;
    margin-bottom: 15px; /* 폼 요소 간의 간격 */
`;

const FormLabelText = styled.h4`
    flex: 1;
    font-size: 18px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FormInput = styled.input`
    width: 300px;
    height: 44px;
    padding: 8px;
    margin-left: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    color: #000;
    font-family: NanumGothic;
    background-color: #fff;
    
    &:focus {
        outline: none; /* 기본 포커스 윤곽선 제거 */
        border: 1px solid #424242; /* 포커스 시 테두리 색상 */
        background-color: #fff; /* 포커스 시 배경색 유지 */
    }
`;

const ModalButton = styled.button`
    width: 100px;
    display: inline-flex;
    margin: 10px;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background: #F6F6F6;
    color: #000;
    font-family: NanumGothic;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 22.4px */
    border: none; /* 버튼 선 없애기 */
    &:hover {
        background-color: #59ABE6;
        color: #FFF; /* 호버 시 텍스트 컬러 */
    }
`;

export default function Newtrip({ closeModal }) {
    const [sharedOptions, setSharedOptions] = useState([{ value: 'none', label: '없음' }]); // api 연결 전 '없음'으로 설정

    const [inputs, setInputs] = useState({
        제목: "",
        기간: "",
        여행지: [], // 여행지 태그로 저장
        공유자: [], // 공유자 태그로 저장
        썸네일: "", // 파일명을 저장
    });

    const { 제목, 기간, 여행지, 공유자, 썸네일 } = inputs;
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false); // 모달 상태
    const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지

    const onChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const handleTagsChange = (type, tags) => {
        setInputs({
            ...inputs,
            [type]: tags
        });
    };

    const handleDateRangeChange = (startDate, endDate) => {
        const formatDate = (date) => {
            const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return offsetDate.toISOString(); // ISO 8601 형식으로 변환
        };
    
        const formattedPeriod = startDate && endDate ? 
            `${formatDate(startDate)} ~ ${formatDate(endDate)}` : 
            '';
    
        setInputs({
            ...inputs,
            기간: formattedPeriod,
            startdate: startDate ? formatDate(startDate) : '', // startdate 추가
            enddate: endDate ? formatDate(endDate) : '' // enddate 추가
        });
    };    

    const handleSubmit = (e) => {
        e.preventDefault();

        // 모든 필드가 입력되었는지 확인
        if (!제목 || !기간 || 여행지.length === 0 || 공유자.length === 0 || !썸네일) {
            setModalMessage("모든 필드를 입력해 주세요."); // 메시지 설정
            setModalOpen(true); // 모달 열기
            return;
        }

        // 입력된 데이터를 state로 editor로 전달
        navigate('/mytrip/editor', {
            state: inputs
        });
    }

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // 이름순으로 친구 목록을 가져오기
                const friends = await getFriendList(2);

                const options = friends.map(friend => ({
                    value: friend.name,
                    label: friend.name, // 표시할 라벨
                }));

                // 친구 목록이 없으면 '없음' 옵션
                if (options.length === 0) {
                    options.push({ value: 'none', label: '없음' });
                }

                // 목록이 있으면 setSharedOptions에 저장
                setSharedOptions(options); 
            } catch (error) {
                console.error('친구 목록 불러오기 실패:', error);
            }
        };

        fetchFriends();
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputs({
                ...inputs,
                썸네일: file // 파일 객체를 상태에 저장
            });
        }
    };    

    return (
        <NewTripContainer>
            <h2>새 여행 일정 만들기</h2>
            <NewTripForm onSubmit={handleSubmit}>
                <FormLabel>
                    <FormLabelText>제목</FormLabelText>
                    <FormInput type="text" name="제목" value={제목} onChange={onChange} />
                </FormLabel>
                <FormLabel>
                    <FormLabelText>기간</FormLabelText>
                    <DateInput onDateRangeChange={handleDateRangeChange} />
                </FormLabel>
                <FormLabel>
                    <FormLabelText>여행지</FormLabelText>
                    <TagInput tags={여행지} setTags={(tags) => handleTagsChange('여행지', tags)} />
                </FormLabel>
                <FormLabel>
                    <FormLabelText>공유자</FormLabelText>
                    <DropdownTagInput tags={공유자} setTags={(tags) => handleTagsChange('공유자', tags)} options={sharedOptions} />
                </FormLabel>
                <FormLabel>
                    <FormLabelText>썸네일</FormLabelText>
                    <FormInput type="file" accept="image/*" onChange={handleImageChange} />
                </FormLabel>
                <div>
                    <ModalButton type="button" onClick={closeModal}>취소</ModalButton>
                    <ModalButton type="submit">다음</ModalButton>   
                </div>
            </NewTripForm>
            <CommonModal
                isOpen={modalOpen}
                onRequestClose={handleModalClose}
                title="알림"
                children={modalMessage}
                type={1} // 타입을 1로 설정
            />
        </NewTripContainer>
    );
}