// FrogTypeChecker.js
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function FrogTypeChecker({ onFrogTypeChange }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const frogType = searchParams.get('frogType');
    onFrogTypeChange(frogType);
  }, [searchParams, onFrogTypeChange]);

  return null; // This component only triggers the effect and renders nothing
}
