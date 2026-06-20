import { Theme } from './settings/types';
import { LoveLetterTemplate } from './components/generated/LoveLetterTemplate';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <LoveLetterTemplate />;
}

export default App;
