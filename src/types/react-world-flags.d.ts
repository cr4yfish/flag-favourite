declare module 'react-world-flags' {
  import { CSSProperties, ReactNode } from 'react';

  interface FlagProps {
    code: string;
    style?: CSSProperties;
    fallback?: ReactNode;
    height?: number | string;
    width?: number | string;
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
