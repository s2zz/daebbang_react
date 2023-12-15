  // 굳이 싶은 더미 코드 이걸 고친거임
  // 코드를 해석하자면 위에 내용은 똑같고
  // 랜더링 될때 해당 스크롤 부분에 이벤트를 추가한다는 뜻임
  // 그리고 랜더링 된 곳에서 나갈때 다시 이벤트를 떼내는거
  // 걍 처음부터 박아놓고 쓰면 되는거 아닌가 ; 굳이 싶어서 코딩 다이어트ㄱ

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = info_scroll.current.scrollTop;
  //     if (scrollTop === 0) {
  //       console.log('최상단입니다.');
  //     } else {
  //       console.log('현재 최상단이 아닌 곳입니다.');
  //       // 원하는 동작 추가
  //     }
  //   };
  
  //   // Add scroll event listener to the .exam element
  //   const info_scroll_element = info_scroll.current;

  //   if (info_scroll_element) {
  //     info_scroll_element.addEventListener('scroll', handleScroll);
  //   }
  
  //   // Remove event listener on component unmount
  //   return () => {
  //     if (info_scroll_element) {
  //       info_scroll_element.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, []);