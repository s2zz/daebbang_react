import { Route, Routes } from 'react-router-dom';
import ReviewApproval from '../ReviewApproval/js/ReviewApproval';

const EstateAgent = () => {
    return (
        <div>
            <div>
                <Routes>
                    <Route path="/" element={<ReviewApproval />}></Route>

                </Routes>
            </div>
        </div >
    );
}

export default EstateAgent;