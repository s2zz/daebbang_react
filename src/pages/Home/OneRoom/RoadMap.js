function(){
    const Main = () => {
      const [position, setPosition] = useState()
      return (
        <>
          <Map // 지도를 표시할 Container
            center={{
              // 지도의 중심좌표
              lat: 33.450701,
              lng: 126.570667,
            }}
            style={{
              width: "100%",
              height: "450px",
            }}
            level={3} // 지도의 확대 레벨
            onDragEnd={(map) => setPosition({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            })}
          >
          </Map>
          {position && <p>{'변경된 지도 중심좌표는 ' + position.lat + ' 이고, 경도는 ' + position.lng + ' 입니다'}</p>}
        </>
      )
    }
    return (<Main/>)
  }