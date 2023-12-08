import axios from 'axios';
const AdminMain = () => {
    axios.get("/api/admin/userip").then((resp) => {
        console.log(resp);
    }).catch(err => {
        console.log(err);
    })
    return (
        <div>
            fsf
        </div>
        
    );
}
export default AdminMain;