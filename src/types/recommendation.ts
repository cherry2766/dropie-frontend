// 사용자 개인화 추천 (GET /users/me/recommendations 응답 항목).
// 백엔드가 60분 캐시. 빈 배열일 수 있음 (콜드 스타트도 후보 0이면 [] 반환).
export type RecommendationEntity = {
  eventId: number;
  brandName: string;
  thumbnailImageUrl: string;
  startAt: string;
  endAt: string;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  // AI(Claude) 생성 문구 — 실패 시 백엔드 폴백 문구가 들어옴. 프론트는 동일 처리.
  message: string;
};
