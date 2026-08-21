'use client';

import { BlockMath } from 'react-katex';

type Props = { math: string };

export default function MathFormula({ math }: Props) {
  return <BlockMath math={math} />;
}
