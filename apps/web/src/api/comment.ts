import apiClient from './axios';
import type { AxiosResponse } from 'axios';
import type { CommentCursorResponse } from '@/types/comment.types';

/**
 * 댓글 목록 조회
 * GET /api/posts/{postId}/comments
 */
export const getComments = (
  postId: number,
): Promise<AxiosResponse<CommentCursorResponse>> => {
  return apiClient.get(`/posts/${postId}/comments`);
};
