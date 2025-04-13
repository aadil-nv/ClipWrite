import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import  {store ,persistor} from "./redux/store.ts"; // Update import


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* Add PersistGate */}
        <StrictMode>
            <App />
        </StrictMode>
    </PersistGate>
  </Provider>,
)