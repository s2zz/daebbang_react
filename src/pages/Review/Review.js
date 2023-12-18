import { Route, Routes } from 'react-router-dom';
import WriteReview from './Write/WriteReview';
import EditReview from './Edit/EditReview';
import style from './Review.module.css';
const Review = () => {
    return (
        <div className={style.container}>
            <Routes>
                <Route path="/writeReview" element={<WriteReview/>}></Route>
                <Route path="/editReview" element={<EditReview/>}></Route>
            </Routes>
        </div>
    );
}

export default Review;