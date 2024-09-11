import { ReactNode, MouseEvent } from 'react';
import styles from './Button.module.css';

function Button({
  children,
  onClick,
  type,
}: {
  children: ReactNode;
  type: 'primary' | 'back' | 'position';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
