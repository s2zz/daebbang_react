import style from "./Login.module.css"

const Login = () => {
    return (
        <div className={style.container}>
            <div className={style.logo}>DAEBBANG</div>
            <div id="inputLogin">
                <div className="loginFont">아이디</div>
                <input type="text" placeholder="input your ID"></input>
                <div className="loginFont">비밀번호</div>
                <input type="password" placeholder="input your PW"></input>
            </div>
            <button>로그인</button>

            <div>
                <a href="#">아이디 찾기</a>
                |
                <a href="#">비밀번호 찾기</a>
            </div>
        </div>
    );
}

export default Login;