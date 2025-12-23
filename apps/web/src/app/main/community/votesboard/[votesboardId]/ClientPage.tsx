'use client';

import React from 'react';
import { Header } from '@/components/header/Header';
import VoteBoardDetail from './components/VotesBoardDetail';
export default function VotesBoardDetailClientPage({
  votesboardId,
}: {
  votesboardId: number;
}) {
  const menuButtonOnClick = () => {
    console.log('Menu button clicked');
    console.log(`Votesboard ID: ${votesboardId}`);
  };

  return (
    <main>
      <Header>
        <Header.Left>
          <Header.BackButton />
        </Header.Left>
        <Header.Center>투표게시판</Header.Center>
        <Header.Right>
          <Header.MenuButton onClick={menuButtonOnClick} />
        </Header.Right>
      </Header>

      <section>
        <VoteBoardDetail votesboardId={votesboardId} />
      </section>
      <section>{/* 댓글 섹션 추후 구현 예정 */}</section>
    </main>
  );
}
