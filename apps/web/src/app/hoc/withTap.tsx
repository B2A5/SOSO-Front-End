// // apps/web/src/hoc/withTap.tsx
// import {
//   ComponentType,
//   PropsWithChildren,
// } from 'react';
// import clsx from 'clsx'; // npm i clsx
// import { useTap } from '@/hooks/useTap';

// /**
//  * 🏗  High-Order Component: withTap
//  *     어떤 컴포넌트든 ‘눌림 인터렉션’을 주입
//  */
// export function withTap<P>(
//   BaseComponent: ComponentType<P>,
// ) {
//   return function TapWrapper(
//     props: PropsWithChildren<
//       P & { className?: string }
//     >,
//   ) {
//     const [pressed, bind] = useTap();

//     return (
//       <BaseComponent
//         {...(props as P)}
//         {...bind}
//         data-pressed={
//           pressed || undefined
//         } /* ★ variant 조건 */
//         className={clsx(
//           'interactive tap:scale-tap' /* 공통 스타일 */,
//           props.className,
//         )}
//       />
//     );
//   };
// }
