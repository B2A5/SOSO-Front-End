/**
 * Drawer 유틸 함수
 *
 * Vaul 구현 참고:
 * https://github.com/emilkowalski/vaul/blob/main/src/use-snap-points.ts
 */

import { SnapPoint } from './DrawerContext';

/**
 * 스냅 포인트를 비율(0~1)로 파싱
 * @example
 * parseSnapPoint(0.5) // 0.5
 * parseSnapPoint("50%") // 0.5
 * parseSnapPoint("30%") // 0.3
 */
export function parseSnapPoint(point: SnapPoint): number {
  if (typeof point === 'number') {
    return point;
  }
  // 문자열인 경우 "50%" -> 0.5
  return parseFloat(point) / 100;
}

/**
 * 속도 임계값 (px/s)
 * Vaul의 VELOCITY_THRESHOLD와 동일
 */
const VELOCITY_THRESHOLD = 500;

/**
 * 빠른 스와이프 임계값 (px/s)
 */
const SWIPE_VELOCITY = 500;

/**
 * 현재 드래그 위치에서 가장 가까운 스냅 포인트를 찾습니다.
 * Vaul의 구현을 참고하여 속도 기반 로직을 적용합니다.
 *
 * @param currentY - 현재 드래그된 Y 위치 (px, 양수 = 아래로 드래그)
 * @param drawerHeight - Drawer 컨테이너 높이 (px)
 * @param snapPoints - 스냅 포인트 배열 (0~1 비율, Drawer 높이 기준)
 * @param velocity - 드래그 속도 (px/s, 양수 = 아래로)
 * @param activeSnapIndex - 현재 활성 스냅 포인트 인덱스
 * @param closeThreshold - 닫기 임계값 (0~1)
 * @returns 가장 가까운 스냅 포인트의 인덱스 (-1이면 닫기)
 *
 * @description
 * Vaul 방식 구현:
 * 1. 빠른 스와이프(velocity > SWIPE_VELOCITY): 방향에 따라 첫/마지막 포인트로
 * 2. 중간 속도: 드래그 거리 40% 미만이면 인접 포인트로
 * 3. 느린 속도: 가장 가까운 포인트로
 *
 * @example
 * // Drawer 높이가 600px일 때
 * // snapPoints = [0.3, 0.6, 1.0]
 * // 0.3 (30%) -> Y = 420px (화면 밖 70% 위치)
 * // 0.6 (60%) -> Y = 240px (화면 밖 40% 위치)
 * // 1.0 (100%) -> Y = 0px (완전 열림)
 */
export function findClosestSnapPoint(
  currentY: number,
  drawerHeight: number,
  snapPoints: SnapPoint[],
  velocity: number,
  activeSnapIndex: number,
  // closeThreshold: number = 0.5
): number {
  // 스냅 포인트를 픽셀 오프셋으로 변환
  const snapPointsOffset = snapPoints.map((point) => {
    const ratio = parseSnapPoint(point);
    // ratio = Drawer가 보여질 높이 비율
    // 0.3 = Drawer 높이의 30%만 보임 -> Y = drawerHeight * 0.7
    // 1.0 = Drawer 전체 보임 -> Y = 0
    return drawerHeight * (1 - ratio);
  });

  // 가장 작은 스냅 포인트 (가장 큰 Y 값 = 가장 아래 위치)
  const minSnapPoint = Math.max(...snapPointsOffset);

  // 닫기 조건: 가장 작은 스냅 포인트보다 더 아래로 드래그 + 여유 공간
  // 예: snapPoints = [0.25, 0.5, 0.9], drawerHeight = 600px
  // minSnapPoint = 600 * 0.75 = 450px (25% 스냅 포인트)
  // closeThresholdY = 450 + 60 = 510px
  const closeThresholdY = minSnapPoint + drawerHeight * 0.1;

  // 닫기 임계값 초과 시 -1 반환
  if (currentY >= closeThresholdY) {
    return -1;
  }

  // 드래그된 비율 계산 (현재 위치 / Drawer 높이)
  const draggedPercentage = Math.abs(currentY) / drawerHeight;

  // 1. 빠른 스와이프 처리 (Vaul 방식)
  if (Math.abs(velocity) > SWIPE_VELOCITY) {
    // 아래로 빠르게 스와이프 (velocity > 0)
    if (velocity > 0) {
      // 첫 번째 스냅 포인트 또는 닫기
      return activeSnapIndex === 0 ? -1 : 0;
    }
    // 위로 빠르게 스와이프 (velocity < 0)
    else {
      // 마지막 스냅 포인트로
      return snapPoints.length - 1;
    }
  }

  // 2. 중간 속도 처리: 드래그 거리 40% 미만이면 인접 포인트로
  if (
    Math.abs(velocity) > VELOCITY_THRESHOLD &&
    draggedPercentage < 0.4
  ) {
    // 아래로 드래그
    if (velocity > 0 && activeSnapIndex > 0) {
      return activeSnapIndex - 1; // 이전 스냅 포인트
    }
    // 위로 드래그
    else if (
      velocity < 0 &&
      activeSnapIndex < snapPoints.length - 1
    ) {
      return activeSnapIndex + 1; // 다음 스냅 포인트
    }
  }

  // 3. 느린 속도: 가장 가까운 스냅 포인트 찾기 (Vaul의 reduce 방식)
  const closestSnapPoint = snapPointsOffset.reduce((prev, curr) => {
    return Math.abs(curr - currentY) < Math.abs(prev - currentY)
      ? curr
      : prev;
  });

  return snapPointsOffset.indexOf(closestSnapPoint);
}

/**
 * 스냅 포인트를 Y 위치(px)로 변환
 * @param snapPoint - 스냅 포인트 (0~1 비율 또는 "50%" 형식, Drawer 높이 기준)
 * @param drawerHeight - Drawer 컨테이너 높이 (px)
 * @returns Y 위치 (px)
 *
 * @example
 * // Drawer 높이 600px일 때
 * snapPointToY(0.3, 600) // 420px (화면 밖 70% 위치)
 * snapPointToY(0.6, 600) // 240px (화면 밖 40% 위치)
 * snapPointToY(1.0, 600) // 0px (완전 열림)
 */
export function snapPointToY(
  snapPoint: SnapPoint,
  drawerHeight: number,
): number {
  const ratio = parseSnapPoint(snapPoint);
  // snapRatio = Drawer가 보여질 높이 비율
  // 0.3 = Drawer 높이의 30%만 보임 -> Y = drawerHeight * 0.7
  // 1.0 = Drawer 전체 보임 -> Y = 0
  return drawerHeight * (1 - ratio);
}
