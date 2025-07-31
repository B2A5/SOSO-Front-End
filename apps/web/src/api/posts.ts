// src/api/posts.ts
import apiClient from './axios'; // 위에서 작성한 기본 설정 파일
import type { AxiosResponse } from 'axios';

/** --------------- 게시글 작성 ---------------- */

// 게시글 작성 폼 데이터 타입
export interface PostFormData {
  title: string;
  content: string;
  category: string;
  images?: File[]; // multipart 지원
}

// 게시글 작성 응답 바디 타입
export interface CreatePostResponse {
  postId: number;
}

// 게시글 작성 (multipart/form-data)
export const createPost = (
  formData: PostFormData,
): Promise<AxiosResponse<CreatePostResponse>> => {
  const data = new FormData();
  data.append('title', formData.title);
  data.append('content', formData.content);
  data.append('category', formData.category);
  formData.images?.forEach((image) => data.append('images', image));

  return apiClient.post<CreatePostResponse>('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
/** --------------- 게시글 조회 ---------------- */
// 게시글 작성자 정보 타입
export interface PostUser {
  nickname: string;
  location: string;
  profileImageUrl: string;
  userType: string;
}
// 게시글 조회 응답 타입
export interface GetPostResponse {
  postId: number;
  title: string;
  content: string;
  category: string;
  imageUrls: string[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  user: PostUser;
}
// 게시글 조회
export const getPost = (
  postId: number,
): Promise<AxiosResponse<GetPostResponse>> => {
  return apiClient.get<GetPostResponse>(`/posts/${postId}`);
};

/** --------------- 게시글 수정 ---------------- */

export const updatePost = (
  postId: number,
  data: Partial<PostFormData>,
): Promise<AxiosResponse<CreatePostResponse>> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.content) formData.append('content', data.content);
  if (data.category) formData.append('category', data.category);
  data.images?.forEach((file) => formData.append('images', file));

  return apiClient.patch<CreatePostResponse>(
    `/posts/${postId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
};

/** --------------- 게시글 삭제 ---------------- */
/**
 * 게시글 삭제 (Soft Delete)
 * - 성공 시 204 No Content
 */
export const deletePost = (
  postId: number,
): Promise<AxiosResponse<void>> => {
  return apiClient.delete<void>(`/posts/${postId}`);
};

/** --------------- 게시글 목록 조회 ---------------- */
// 커서 기반 조회 쿼리
export interface CursorQuery {
  category?: string;
  sort?: 'LATEST' | 'LIKE' | 'COMMENT';
  cursor?: string;
  idAfter?: number;
  size?: number;
}

// 게시글 요약 정보
export interface PostSummary {
  postId: number;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  user: {
    nickname: string;
    location: string;
    profileImageUrl: string;
    userType: string;
  };
}

// 커서 DTO
export interface CursorDto {
  hasNext: boolean;
  cursor: string;
  idAfter: number;
}

// 커서 기반 조회 응답
export interface PostCursorResponse {
  posts: PostSummary[];
  nextCursor: CursorDto;
}

/**
 * 커서 기반 게시글 목록 조회
 * @param params category, sort, cursor, idAfter, size
 */
export const getPostsByCursor = (
  params: CursorQuery,
): Promise<AxiosResponse<PostCursorResponse>> => {
  return apiClient.get<PostCursorResponse>('/posts/cursor', {
    params,
  });
};
