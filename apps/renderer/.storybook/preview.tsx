import type { Preview } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { CartProvider } from '../src/components/shop/cart-context';
import { MotionProvider } from '../src/components/motion-provider';
import '../src/globals.css';

const preview: Preview = {
  decorators: [
    (Story): ReactNode => (
      <MotionProvider>
        <CartProvider>
          <Story />
        </CartProvider>
      </MotionProvider>
    ),
  ],
  parameters: {
    a11y: { test: 'error' },
    controls: { expanded: true },
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    options: {
      storySort: {
        order: ['Section Lab', ['Catalog', 'Stress states']],
      },
    },
  },
};

export default preview;
