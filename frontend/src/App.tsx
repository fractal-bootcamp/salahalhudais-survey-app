import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SurveyList } from './pages/SurveyList';
import { CreateSurvey } from './pages/CreateSurvey';
import { SurveyDetail } from './pages/SurveyDetail';
import { TakeSurvey } from './pages/TakeSurvey';
import { Layout } from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SurveyList />} />
          <Route path="/create" element={<CreateSurvey />} />
          <Route path="/surveys/:id" element={<SurveyDetail />} />
          <Route path="/surveys/:id/take" element={<TakeSurvey />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;