const BASE_URL = 'https://www.yeogida.net';

/* 스크랩 폴더 목록 조회 */
export const getFolderData = async () => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error "getFolderData":', error);
        throw error;
    }
};

/* 스크랩 폴더 생성 */
export const fetchFolderAdd = async (folderName) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
            body: JSON.stringify({
                folderName
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderAdd":', error);
        throw error;
    }
};

/* 스크랩 폴더 삭제 */
export const fetchFolderDelete = async (folderId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/delete/${folderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderDelete":', error);
        throw error;
    }
};

/* 스크랩 폴더 이름 수정 */
export const fetchFolderNameUpdate = async (folderId, folderName) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/rename/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
            body: JSON.stringify({
                folderId, folderName
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderNameUpdate":', error);
        throw error;
    }
};

/* 특정 스크랩 폴더의 스크랩 목록 조회 */
export const getScrapData = async (folderId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/${folderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error "getScrapData":', error);
        throw error;
    }
};

/* 특정 스크랩 삭제 */
export const fetchScrapDelete = async (folderId, scrapId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }
    
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/${folderId}/delete/${scrapId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchScrapDelete":', error);
        throw error;
    }
};