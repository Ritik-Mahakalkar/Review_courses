import logo from './logo.svg';
import './App.css';
import CourseReviewPage from './Component/CourseReviewPage';

function App() {
  return (
    <div className="App">
      <CourseReviewPage courseId={1} userId={1}/>
    </div>
  );
}

export default App;
