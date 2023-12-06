import style from "./Login.module.css"

const Login = () => {
    return (
        <div className={style.container}>
            <div className={style.loginBox}>
                <div className={style.logo}>DAEBBANG</div>
                <div className={style.inputLoginBox}>
                    <div className={style.inputLogin}>
                        <div className={style.loginFont}>아이디</div>
                        <input type="text" placeholder="input your ID"></input>
                        <div className={style.loginFont}>비밀번호</div>
                        <input type="password" placeholder="input your PW"></input>
                    </div>
                </div>
                <div className={style.btnBox}>
                    <button className={style.loginBtn}>로그인</button>
                </div>
                <div className={style.findBox}>
                    <a className={style.findId} href="#">아이디 찾기</a>
                    <a className={style.findPw} href="#">비밀번호 찾기</a>
                </div>
            </div>
        </div>
    );
}

export default Login;