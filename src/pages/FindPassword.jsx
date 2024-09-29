import React, { useState, useEffect } from 'react';
import FindInput from '../components/FindInputField'; // 새로 만든 InputField 컴포넌트 import
import EmailVerificationField from '../components/EmailVerificationField'; // New component
import { useNavigate } from 'react-router-dom';
import Button from '../components/Btn';
import styled from 'styled-components';
import CommonModal from '../components/CommonModal';

const FindPasswordForm = styled.div`
    margin-top: 120px;
    box-sizing: border-box; /* 패딩을 포함한 너비 계산 */
    min-width: 1050px;
    padding: 50px 0px;
`;

const TitleStyle = styled.h3`
    font-weight: bold;
    font-size: 40px;
    text-align: center;
    margin-bottom: 40px;
`;

const FindPasswordInput = styled.div`
    max-width: 490px;
    padding: 0px 10px 6px;
    margin: auto;
    position: relative;
`;

const TitleLabel = styled.label`
    display: inline-block;
    padding: 8px 0px 15px;
    font-size: 24px;
    line-height: 19px;
    margin-top: 25px;
`;

const ButtonStyle = styled.div`
    margin-top: 25px;
`;

export default function FindPassword() {
    const [formData, setFormData] = useState({
        userName: '',
        userId: '',
        email: '',
    });

    const [errors, setErrors] = useState({
        userName: '',
        userId: '',
        email: '',
    });
    const [showCertificationInput, setShowCertificationInput] = useState(false);
    const [timer, setTimer] = useState(180);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [navigateTo, setNavigateTo] = useState('');

    const validate = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'userName':
                if (!value) error = '이름을 입력해주세요.';
                break;
            case 'userId':
                if (value.length < 6 || value.length > 16) {
                    error =
                        '6자 이상 16자 이하의 영문 혹은 숫자를 조합해주세요.';
                }
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value))
                    error = '이메일 형식이 맞지 않습니다.';
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        validate(id, value);
    };

    const isFormValid = () => {
        return (
            !errors.userName &&
            !errors.userId &&
            !errors.email &&
            formData.userName &&
            formData.userId &&
            formData.email
        );
    };

    const isCertificationValid = () => {
        return (
            formData.certificationNum && formData.certificationNum.length === 6
        );
    };

    const isEmailValid = () => {
        return (
            formData.userName &&
            !errors.userName &&
            formData.email &&
            !errors.eamil
        );
    };

    //해당 계정 유무 확인(api 요청)
    const checkAccountExists = async () => {
        // try {
        //     const response = await fetch('users/find/password', {
        //         method: 'POST',
        //         headers: {
        //             ContentType: 'application/json',
        //         },
        //         body: JSON.stringify({
        //             name: formData.userName,
        //             email: formData.email,
        //         }),
        //     });

        //     if (response.status === 200) {
        //         return true;
        //     } else if (response.status === 404) {
        //         openModal('해당하는 회원정보가 없습니다.');
        //         return false;
        //     } else {
        //         openModal(
        //             '서버 에러가 발생했습니다. 나중에 다시 시도해주세요.'
        //         );
        //         return false;
        //     }
        // } catch (error) {
        //     openModal('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        //     return false;
        // }
        return true;
    };

    // 이메일 인증하기 버튼 핸들러
    const handleSendCode = async () => {
        if (isFormValid()) {
            const accountExists = await checkAccountExists(); // 계정 존재 여부 확인
            if (accountExists) {
                openModal('인증번호를 전송했습니다.');
                setShowCertificationInput(true);
                setTimer(180); // 타이머 초기화
            }
        }
    };

    //인증번호 입력 후 확인 버튼 핸들러
    const handleSubmit = async () => {
        if (isCertificationValid()) {
            try {
                const response = await fetch('/users/idpw-sendnum', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        code: formData.certificationNum,
                    }),
                });

                const data = await response.json();

                if (response.status === 200) {
                    openModal('인증에 성공하였습니다.', '/find/id/success');
                } else if (response.status === 404) {
                    openModal(response.message);
                } else if (response.status === 500) {
                    openModal(response.message);
                } else {
                    openModal('서버 오류가 발생했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                openModal('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    useEffect(() => {
        let interval = null;
        if (showCertificationInput && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            openModal('유효 시간이 만료되었습니다. 다시 시도해주세요.');
            setShowCertificationInput(false); // 입력 필드 숨기기
            // 인증번호 삭제 로직 추가
            // 예시: await fetch('/api/deleteCode', { method: 'DELETE' });
        }
        return () => clearInterval(interval);
    }, [showCertificationInput, timer]);

    // 모달
    const openModal = (message, navigateToPage = '') => {
        setModalMessage(message);
        setNavigateTo(navigateToPage); // navigateTo 설정
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    //인증번호 재전송 버튼 핸들러
    const handleResendCode = () => {
        if (timer > 60) {
            // 타이머가 1분 이상 남았을 경우
            openModal(
                '재발송 요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.'
            );
        } else {
            // 타이머가 1분 미만 남았을 경우
            // openModal('인증번호를 재전송하였습니다.');
            setFormData((prev) => ({
                ...prev,
                certificationNum: '', // 인증번호 입력 필드 초기화
            }));
            setTimer(180); // 타이머 초기화

            // API 요청을 통해 인증번호를 재전송
            resendCodeAPI();
        }
    };

    // 인증번호 재전송 API 호출 함수
    const resendCodeAPI = async () => {
        try {
            const response = await fetch('/api/resendCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.userName,
                }),
            });

            if (response.status === 200) {
                openModal('인증번호가 재전송되었습니다.');
            } else {
                openModal('서버 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            openModal('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <FindPasswordForm>
            <TitleStyle>비밀번호 찾기</TitleStyle>
            <FindPasswordInput>
                <TitleLabel>이름</TitleLabel>
                <FindInput
                    type="text"
                    id="userName"
                    placeholder="이름을 입력해주세요."
                    height="80px"
                    marginbottom="15px"
                    onChange={handleChange}
                    value={formData.userName}
                    error={!!errors.userName} // 에러가 있는 경우 true로 설정
                    errorMessage={errors.userName} // 에러 메시지 전달
                    disabledInput={showCertificationInput} // 인증번호 입력 중일 때 비활성화
                />
                <TitleLabel>아이디</TitleLabel>
                <FindInput
                    type="text"
                    id="userId"
                    placeholder="아이디를 입력해주세요."
                    height="80px"
                    marginbottom="15px"
                    onChange={handleChange}
                    value={formData.userId}
                    error={!!errors.userId} // 에러가 있는 경우 true로 설정
                    errorMessage={errors.userId} // 에러 메시지 전달
                    disabledInput={showCertificationInput} // 인증번호 입력 중일 때 비활성화
                />
                <TitleLabel>이메일</TitleLabel>
                <FindInput
                    type="email"
                    id="email"
                    placeholder="이메일"
                    height="80px"
                    marginbottom="40px"
                    onChange={handleChange}
                    value={formData.email}
                    error={!!errors.email}
                    errorMessage={errors.email}
                    isEmailVerification={true}
                    onSendCode={handleSendCode}
                    disabledBtn={showCertificationInput || !isEmailValid()}
                    disabledInput={showCertificationInput} // 인증번호 입력 중일 때 비활성화
                />
                {showCertificationInput && (
                    <>
                        <TitleLabel>인증 번호</TitleLabel>
                        <FindInput
                            type="tel"
                            id="certificationNum"
                            placeholder="인증 번호 6자리"
                            height="80px"
                            marginbottom="40px"
                            onChange={handleChange}
                            value={formData.certificationNum || ''}
                            error={false} // 인증 번호 입력 필드는 에러 처리하지 않음
                            timerValue={`${Math.floor(timer / 60)}:${
                                timer % 60 < 10 ? `0${timer % 60}` : timer % 60
                            }`} // 타이머 값 전달
                            isVerificationCode={true}
                            onResendCode={handleResendCode}
                        />
                    </>
                )}
                <ButtonStyle>
                    <Button
                        width="490px"
                        height="80px"
                        borderRadius="10px"
                        fontSize="26px"
                        text="확인"
                        onClick={handleSubmit}
                        disabled={!isCertificationValid()} // 인증번호 입력 중이면 비활성화
                    />
                </ButtonStyle>
                {/* 모달 추가 */}
                <CommonModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    title={modalMessage}
                    navigateTo={navigateTo} // navigateTo 전달
                ></CommonModal>
            </FindPasswordInput>
        </FindPasswordForm>
    );
}
