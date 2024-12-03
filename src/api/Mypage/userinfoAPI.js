const BASE_URL = 'https://www.yeogida.net';

/* 비밀번호를 통한 본인 확인 */
export const checkPassword = async (data) => {
    const response = await fetch(`${BASE_URL}/mypage/account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: data.passwordConfirm }), // 요청 본문에 password 전달
        // credentials: 'include' // 세션 기반 인증을 위한 쿠키 포함
    });

    if (response.ok) { // 응답 상태 코드 확인
        try {
            return await response.json(); // 응답이 JSON인지 확인
        } catch (err) {
            const textResponse = await response.text(); // JSON 형식이 아닐 경우 텍스트로 처리
            return { success: false, message: textResponse };
        }
    } else {
        const textResponse = await response.text();
        return { success: false, message: textResponse };
    }
};

/* 개인정보 조회 */
export const getUserData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/account`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data[0]; // 첫 번째 사용자 데이터 반환
    } catch (error) {
        console.error('Error "getUserData":', error);
        throw error; // 에러 발생 시 상위로 전달
    }
};

/* 사용자 아이디 */
export const getUserId = async () => {
    const token = localStorage.getItem('authToken'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/account`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();  // 응답을 JSON으로 처리
        return data.id;  // 첫 번째 사용자 데이터에서 아이디 반환
    } catch (error) {
        console.error('Error "getUserId":', error);
        throw error;
    }
};

/* 개인정보 수정 */
export const updateUserData = async (updatedData) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
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
    try {
        const response = await fetch('/users/signup-sendnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    try {
        const response = await fetch('/users/verify-number', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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