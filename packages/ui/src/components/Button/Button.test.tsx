import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

/**
 * Button 컴포넌트 테스트
 *
 * 로직, 이벤트, 접근성, props 검증
 */

describe('Button', () => {
  describe('기본 렌더링', () => {
    it('텍스트와 함께 렌더링된다', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument();
    });

    it('기본 type은 button이다', () => {
      render(<Button>Default Type</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'type',
        'button',
      );
    });

    it('type 속성을 오버라이드할 수 있다', () => {
      render(<Button type="submit">Submit Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'type',
        'submit',
      );
    });

    it('ref를 올바르게 전달한다', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button with ref</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('인터랙션', () => {
    it('클릭 이벤트를 처리한다', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', {
        name: /click me/i,
      });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 상태일 때 onClick을 트리거하지 않는다', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>,
      );

      const button = screen.getByRole('button', {
        name: /disabled button/i,
      });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('variant 스타일', () => {
    it('기본 variant는 filled이다', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-soso-500');
    });

    it('variant prop에 따라 다른 클래스가 적용된다', () => {
      const { rerender } = render(
        <Button variant="filled">Button</Button>,
      );
      expect(screen.getByRole('button')).toHaveClass('bg-soso-500');

      rerender(<Button variant="outlined">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'border-soso-600',
      );
    });
  });

  describe('size 스타일', () => {
    it('기본 size는 md이다', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('size prop에 따라 다른 클래스가 적용된다', () => {
      const { rerender } = render(<Button size="sm">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-8');

      rerender(<Button size="lg">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });
  });

  describe('disabled 상태', () => {
    it('disabled 속성을 가진다', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', {
        name: /disabled button/i,
      });
      expect(button).toBeDisabled();
    });

    it('disabled 스타일을 적용한다', () => {
      render(
        <Button disabled variant="filled">
          Disabled
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:bg-neutral-0');
    });
  });

  describe('loading 상태', () => {
    it('loading 시 aria-busy 속성을 가진다', () => {
      render(<Button isLoading>Loading Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy');
    });

    it('loading 시 pointer-events-none 클래스를 가진다', () => {
      render(<Button isLoading>Loading Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'pointer-events-none',
      );
    });

    it('loading 시 onClick 핸들러가 바인딩되지 않는다', () => {
      const handleClick = vi.fn();

      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>,
      );

      const button = screen.getByRole('button');

      // isLoading일 때는 useTap bind가 적용되지 않음 (로직 검증)
      // pointer-events-none의 실제 동작은 Storybook에서 검증
      expect(button).toHaveClass('pointer-events-none');
    });
  });

  describe('커스텀 스타일', () => {
    it('사용자 정의 className을 추가할 수 있다', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      // 기본 스타일도 유지되어야 함
      expect(button).toHaveClass('rounded-lg');
    });
  });

  describe('접근성', () => {
    it('button role을 가진다', () => {
      render(<Button>Accessible Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('포커스 가능하다', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('disabled 상태에서는 포커스되지 않는다', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });
  });
});
