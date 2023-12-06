import style from "../css/BoardList.module.css";
import favorite from "../../assets/favorites.png";

const FavoriteBoardList = () => {
    return (
        <>
            <div className={style.boardTitle}>즐겨찾기</div>
            <hr></hr>
            <div className={style.searchDiv}>
                <div className={style.searchBox}>
                    <div>icon</div>
                    <div>
                        <input placeholder="검색어" />
                    </div>
                    <div>
                        <button>Search</button>
                    </div>
                </div>
            </div>
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div><img src={favorite}/></div>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>날짜</div>
                </div>
                <div className={style.boardListContents}>
                    <div>
                        <div><img src={favorite}/></div>
                        <div>1</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>2</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>3</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>4</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>5</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>6</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>7</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>8</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>9</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                    <div>
                    <div><img src={favorite}/></div>
                        <div>10</div>
                        <div>test0000</div>
                        <div>배달 같이 시킬 사람 구함</div>
                        <div>2023.12.03</div>
                    </div>
                </div>
            </div>
            <div className={style.naviFooter}>
                &lt; 1 2 3 4 5 6 7 8 9  10 &gt;
            </div>

        </>
    );
}

export default FavoriteBoardList;