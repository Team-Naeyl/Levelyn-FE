import { API_BASE_URL } from './api';

const getToken = () => localStorage.getItem('accessToken');

const sseConnections: { [key: string]: EventSource } = {};

export const connectSSE = (endpoint: string, eventHandlers: { [event: string]: (data: any) => void }) => {
  const token = getToken();
  if (!token) {
    console.error(`SSE 연결 실패: 액세스 토큰이 없습니다. (${endpoint})`);
    return;
  }

  if (sseConnections[endpoint]) {
    console.warn(`SSE 연결이 이미 존재합니다: ${endpoint}`);
    return;
  }

  const url = `${API_BASE_URL}${endpoint}?token=${token}`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onopen = () => {
    console.log(`SSE 연결 성공: ${endpoint}`);
  };

  eventSource.onerror = (error) => {
    console.error(`SSE 에러 발생 (${endpoint}):`, error);
    eventSource.close();
    delete sseConnections[endpoint];
  };

  // 서버에서 오는 모든 메시지를 처리하는 리스너
  eventSource.onmessage = (e) => {
    if (!e.data) return;

    try {
      const message = JSON.parse(e.data);

      // notifications 스트림의 메시지 처리
      const eventType = message.event?.toUpperCase();
      if (eventType && eventHandlers[eventType]) {
        if (eventType === 'ping') return;
        eventHandlers[eventType](message.data);
        return;
      }

      // Cbattles/{id} 스트림의 메시지 처리
      if (eventHandlers.message) {
        eventHandlers.message(message);
        return;
      }
      if (eventType !== 'ping') {
        console.warn(`처리되지 않은 SSE 이벤트 수신:`, message);
      }
    } catch (err) {
      console.error('SSE 메시지 파싱 또는 처리 중 에러 발생:', e.data, err);
    }
  };

  sseConnections[endpoint] = eventSource;

  return eventSource;
};

/**
 * 특정 SSE 연결을 종료
 * @param endpoint - 종료할 SSE 엔드포인트
 */
export const disconnectSSE = (endpoint: string) => {
  const eventSource = sseConnections[endpoint];
  if (eventSource) {
    eventSource.close();
    delete sseConnections[endpoint];
    console.log(`SSE 연결 종료: ${endpoint}`);
  }
};

/**
 * 모든 활성화된 SSE 연결을 종료
 */
export const disconnectAllSSE = () => {
  Object.keys(sseConnections).forEach(disconnectSSE);
};
