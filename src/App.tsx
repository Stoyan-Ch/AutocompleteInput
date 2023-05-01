import { AutocompleteInput } from './components/AutocompleteInput/AutocompleteInput';
import { searchOptions } from './searchOptions';
import logo from './assets/logo.png';

function App() {
  return (
    <div>
      <img
        style={{ display: 'block', margin: '0 auto' }}
        alt='logo'
        src={logo}
        width={'20%'}
        height={'20%'}
      />
      <AutocompleteInput options={searchOptions} />
    </div>
  );
}

export default App;
