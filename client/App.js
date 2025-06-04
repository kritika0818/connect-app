import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'; // 👈 Redux Provider
import RootNavigator from './navigation';
import store from './redux/store'; // 👈 Your Redux store

export default function App() {
  return (
    <Provider store={store}>                   
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
