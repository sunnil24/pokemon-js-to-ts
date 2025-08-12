import type { Preview } from "@storybook/react-webpack5";
import "rsuite/dist/rsuite.min.css"; // Import RSuite styles
import "../src/App.css"; // Import app-specific styles
import "../src/index.css"; // Import global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
