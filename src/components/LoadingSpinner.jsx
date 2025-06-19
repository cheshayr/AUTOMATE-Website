import { Loader2 } from 'lucide-react';
import React from 'react';

function LoadingSpinner() {
  return (
    <div>
      <Loader2 className="animate-spin" aria-label="Loading" />
    </div>
  );
}

export default LoadingSpinner;
