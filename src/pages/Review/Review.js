import { Route, Routes } from 'react-router-dom';
import WriteReview from './Write/WriteReview';
import EditReview from './Edit/EditReview';

const Review = () => {
    return (
        <div>
            <Routes>
                <Route path="/writeReview" element={<WriteReview/>}></Route>
                <Route path="/editReview" element={<EditReview/>}></Route>
            </Routes>
        </div>
    );
}

export default Review;