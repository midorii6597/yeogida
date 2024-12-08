// 나의 여행 일정 조회 API
export const getTrip = async (userId) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`https://yeogida.net/api/itineraries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Error fetching trips');
        return await response.json(); // JSON 응답을 반환
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};

// 새로운 여행일정 생성 API
export const createItineraries = async (formData) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch('https://yeogida.net/api/itineraries', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            body: formData, // FormData를 그대로 전달
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP 에러 발생:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json(); // 응답을 JSON 형태로 반환
    } catch (error) {
        console.error('Error in createItineraries:', error);
        throw error;
    }
};

// 특정 여행일정 조회 API
export const getItineraries = async (itinerary_id) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`https://yeogida.net/api/itineraries/${itinerary_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('일정 정보를 불러오는 데 실패했습니다.');
        }

        return await response.json(); // 응답을 JSON 형태로 반환
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
};

// 특정 여행일정 수정 API
export const updateItinerary = async (itineraryId, updatedData) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`https://yeogida.net/api/itineraries/${itineraryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
            body: JSON.stringify(updatedData), // 수정할 데이터
        });

        if (!response.ok) {
            throw new Error('여행 일정 수정에 실패했습니다.');
        }

        return await response.json(); // 성공 시 응답 반환
    } catch (error) {
        console.error('오류 발생:', error.message);
        throw error;
    }
};

// 특정 여행일정 삭제 API
export const deleteItinerary = async (itinerary_id) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return;
    }

    try {
        const response = await fetch(`https://yeogida.net/api/itineraries/${itinerary_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('일정 삭제에 실패했습니다.');
        }

        alert('일정이 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('오류:', error);
        alert('일정 삭제 중 오류가 발생했습니다.');
        throw error;
    }
};

// 지도의 장소 검색 API
export const handleSearch = async (searchQuery) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

    if (!token) {
        console.error('토큰이 없습니다!');
        return [];
    }

    if (!searchQuery) return []; // 검색어가 없으면 빈 배열 반환

    try {
        console.log('장소 검색 요청 시작');
        console.log(`검색어: ${searchQuery}`);

        const response = await fetch(`https://yeogida.net/api/places/search?query=${encodeURIComponent(searchQuery)}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
            },
            credentials: 'include',
        });

        if (response.status === 404) {
            console.error('검색 결과가 없습니다.');
            return []; // 빈 배열 반환
        }

        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다.');
        }

        return await response.json(); // 응답을 JSON 형태로 반환
    } catch (error) {
        console.error('장소 검색 중 오류 발생:', error);
        throw error;
    }
};