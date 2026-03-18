import { Spin } from 'antd';
import React from 'react';

function Dynamic({
  fallback,
  component: DynamicComponent,
}: {
  component: React.LazyExoticComponent<React.ComponentType>;
  fallback?: React.ReactNode;
}) {
  return (
    <React.Suspense
      fallback={
        fallback || (
          <div className="flex h-full items-center justify-center min-h-[45vh] w-full">
            <Spin spinning />
          </div>
        )
      }
    >
      <DynamicComponent />
    </React.Suspense>
  );
}

export default Dynamic;
