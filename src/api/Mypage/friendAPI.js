const BASE_URL = 'https://www.yeogida.net';

/* 친구 목록 조회 (최신순, 이름순) */
export const getFriendList = async (sortOption) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const url = sortOption === 1 
            ? `${BASE_URL}/mypage/friend?status=recent`
            : `${BASE_URL}/mypage/friend?status=name`;
        
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getFriendList":', error);
        throw error;
    }
};

/* 친구 삭제 */
export const deleteFriend = async (friendId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/${friendId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to delete friend');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "deleteFriend":', error);
        throw error;
    }
};

/* 친구 요청 목록 조회 */
export const getFriendRequest = async (userId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const res = await fetch(`https://yeogida.net/mypage/friend/friendrequest?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getFriendRequest":', error);
        throw error;
    }
};

/* 친구 요청 승낙 */
export const fetchFriendRequestAccept = async (friendId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/friendrequest/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
            body: JSON.stringify({
                friendId,
                friendStatus: 1, // 항상 1로 설정
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to accept friend request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFriendRequestAccept":', error);
        throw error;
    }
};

/* 친구 요청 거절 */ 
export const fetchFriendRequestReject = async (friendId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/friendrequest/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
            body: JSON.stringify({
                friendId,
                friendStatus: 1, // 항상 1로 설정
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to reject friend request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFriendRequestReject":', error);
        throw error;
    }
};

/* 친구 검색 */ 
export const getSearchedFriend = async (userId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/mypage/friend?search=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getSearchedFriend":', error);
        throw error;
    }
};

/* 친구 추가 */ 
export const fetchAddFriend = async (userId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                userId
            }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found'); // 404 에러 처리
            }
            throw new Error('Failed to add friend');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchAddFriend":', error);
        throw error;
    }
};