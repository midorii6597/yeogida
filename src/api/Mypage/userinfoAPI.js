const BASE_URL = 'https://www.yeogida.net';

/* 비밀번호를 통한 본인 확인 */
export const checkPassword = async (data) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }
    
    try {
        const response = await fetch(`https://yeogida.net/mypage/account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰 전달
            },
            body: JSON.stringify({
                password: data.passwordConfirm, // 요청에 비밀번호 전달
            }),
            credentials: 'include',
        });

        if (response.ok) {
            // 응답이 성공(200번대)인 경우
            return await response.json();
        } else {
            // 응답이 실패한 경우
            const errorText = await response.text(); // 텍스트 응답 읽기
            try {
                const errorJson = JSON.parse(errorText); // JSON으로 파싱 시도
                return { success: false, message: errorJson.message || errorText };
            } catch (err) {
                // JSON 파싱 실패 시 텍스트 그대로 반환
                return { success: false, message: errorText };
            }
        }
    } catch (err) {
        console.error('요청 중 에러 발생:', err);
        return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
};

/* 개인정보 조회 */
export const getUserData = async () => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    console.log('(마이페이지) 현재 토큰:', token);

    try {
        // 요청 전 디버깅 정보 출력
        console.log('Sending request to API...');
        console.log('Headers:', {
            'Authorization': `Bearer ${token}`,
        });

        // API 호출
        const response = await fetch('https://yeogida.net/mypage/account', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include', // 쿠키 포함 여부
        });

        // 응답 상태와 헤더 확인
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // 응답 본문 확인 (JSON으로 파싱하기 전에 원문 확인)
        const responseText = await response.text();
        console.log('Response body:', responseText);

        // 응답이 성공적이지 않은 경우 오류 처리
        if (!response.ok) {
            // 401 Unauthorized 에러의 경우 상세 메시지 처리
            if (response.status === 401) {
                const errorData = JSON.parse(responseText);
                console.error('인증 실패:', errorData.message);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // JSON 파싱 후 데이터 반환
        const data = JSON.parse(responseText);
        return data; // 사용자 데이터 반환
    } catch (error) {
        console.error('Error "getUserData":', error);
        throw error; // 에러 발생 시 상위로 전달
    }
};


/* 개인정보 수정 */
export const updateUserData = async (updatedData) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(updatedData),
        });

        if (response.status == 400) {
            throw new Error('Invalid input data - 잘못된 요청 (입력 데이터 오류)');
        } else if (response.status == 401) {
            throw new Error('Invalid or expired token - 인증 실패 (토큰 만료 또는 유효하지 않은 토큰)');
        } else if (response.status == 500) {
            throw new Error('Internal server error - 서버 오류');
        } else if (!response.ok) {
            throw new Error('Failed to update user data');
        }

        const result = await response.json(); // 서버 응답 처리
        return result;
    } catch (error) {
        console.error('Error "updateUserData":', error);
        throw error;
    }
};

/* (회원가입용) 메일로 인증번호 전송 API */
export const sendEmailVerificationCode = async (email, userName) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch('/users/signup-sendnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                name: userName,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            return { success: true, message: data.message };
        } else if (response.status === 409) {
            return { success: false, message: '기존에 회원가입한 이메일입니다.' };
        } else if (response.status === 500) {
            return { success: false, message: '500 서버 에러 발생' };
        } else {
            return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
        }
    } catch (error) {
        console.error('Error sending email verification code:', error);
        return { success: false, message: '서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.' };
    }
};

/* 인증번호 검증 API */
export const verifyCertificationCode = async (email, certificationNum) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }
    
    try {
        const response = await fetch('/users/verify-number', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                code: certificationNum,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || '인증에 실패했습니다.' };
        }
    } catch (error) {
        console.error('Error verifying certification code:', error);
        return { success: false, message: '인증에 실패했습니다. 다시 시도해주세요.' };
    }
};