'use client';

import Image from 'next/image';
import { Link } from 'lucide-react';
import { Drawer } from '@/components/Drawer';
import { useToast } from '@/hooks/ui/useToast';
import { shareViaKakao } from '@/lib/kakao-share';

interface VoteShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

export function VoteShareDrawer({
  isOpen,
  onClose,
  title,
}: VoteShareDrawerProps) {
  const toast = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('링크가 복사되었습니다.', 'success');
    } catch {
      toast('링크 복사에 실패했습니다.', 'error');
    }
    onClose();
  };

  const handleKakao = async () => {
    const url = window.location.href;
    try {
      await shareViaKakao({
        objectType: 'feed',
        content: {
          title,
          description: '소소에서 투표에 참여해보세요!',
          imageUrl: `${window.location.origin}/icons/Logo.svg`,
          link: { webUrl: url, mobileWebUrl: url },
        },
        buttons: [
          {
            title: '투표하기',
            link: { webUrl: url, mobileWebUrl: url },
          },
        ],
      });
    } catch {
      toast('카카오톡 공유에 실패했습니다.', 'error');
    }
    onClose();
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast(
        '링크를 복사했어요. 인스타그램에 붙여넣기 해주세요.',
        'success',
      );
    } catch {
      toast('링크 복사에 실패했습니다.', 'error');
    }
    onClose();
  };

  const SHARE_ITEMS = [
    {
      key: 'link',
      label: '링크 복사하기',
      icon: (
        <Link className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      ),
      onClick: handleCopyLink,
    },
    {
      key: 'kakao',
      label: '카카오톡 공유하기',
      icon: (
        <Image
          src="/icons/kakao.svg"
          alt="카카오톡 공유하기"
          width={20}
          height={20}
        />
      ),
      onClick: handleKakao,
    },
  ];

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      closeOnBackground
      closeOnDrag
    >
      <Drawer.Overlay />
      <Drawer.Content>
        {SHARE_ITEMS.map(({ key, label, icon, onClick }) => (
          <Drawer.Items
            key={key}
            onClick={onClick}
            closeOnClick={false}
          >
            <div className="flex items-center gap-3">
              {icon}
              <span>{label}</span>
            </div>
          </Drawer.Items>
        ))}
      </Drawer.Content>
    </Drawer.Root>
  );
}
