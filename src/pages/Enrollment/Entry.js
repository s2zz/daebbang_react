import 'bootstrap/dist/css/bootstrap.min.css';
import signupImage from './assets/enroll2.png';
import successImage from './assets/success.jpg';
import style from "./Enrollment.module.css"
import { Link } from 'react-router-dom';
import Footer from "../commons/Footer";

const Entry = () => {
  return (
    <div className={style.container}>
      <div className={style.imgbag} style={{padding:"50px"}}>
        <img style={{width:'60%',position:'relative',left:'1.2%'}} className={style.img} src={signupImage} alt="등록" />
      </div>
      <div>
        <img style={{width:'100%'}} src={successImage} alt="등록" />
      </div>
      <div style={{display:'flex', justifyContent:'center',marginTop:'3%'}}>
        <Link to={`/`} style={{ textDecoration: 'none'}}>&raquo; 홈으로 돌아가기</Link>
      </div>
      <div>
      <Footer/>
      </div>
    </div>
  );
}

export default Entry;