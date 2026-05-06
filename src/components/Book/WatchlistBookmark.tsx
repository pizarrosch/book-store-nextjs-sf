import {Icon} from '@blueprintjs/core';
import React, {useState} from 'react';
import s from './WatchlistBookmark.module.scss';

type WatchlistBookmarkProps = {
  isActive: boolean;
  onToggle: () => void;
  size?: number;
  variant?: 'default' | 'compact';
};

export default function WatchlistBookmark({
  isActive,
  onToggle,
  size = 22,
  variant = 'default'
}: WatchlistBookmarkProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 350);
    onToggle();
  };

  const btnClass =
    variant === 'compact'
      ? isActive
        ? s.bookmarkBtnCompactActive
        : s.bookmarkBtnCompact
      : isActive
        ? s.bookmarkBtnActive
        : s.bookmarkBtn;

  return (
    <button
      onClick={handleClick}
      className={btnClass}
      aria-label={isActive ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Icon
        icon="bookmark"
        size={size}
        color={isActive ? 'var(--color-primary)' : 'var(--color-gray-400)'}
        className={isAnimating ? s.heartAnimate : undefined}
      />
    </button>
  );
}
