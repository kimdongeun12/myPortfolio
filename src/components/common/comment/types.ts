export type CommentData = {
  id: string;
  nickname: string;
  content: string;
  createdAt: string; // ISO 날짜
  replies?: CommentData[];
};

/** 작성 폼에서 넘어오는 값 (비밀번호는 수정·삭제 확인용, 화면에는 표시하지 않음) */
export type CommentInput = {
  nickname: string;
  password: string;
  content: string;
};
