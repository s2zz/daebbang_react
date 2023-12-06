import ReactQuill from "react-quill";

const WriteBoard = () => {
    const modules = {
        toolbar: {
          container: [
            ["image"],
            [{ header: [1, 2, 3, 4, 5, false] }],
            ["bold", "underline"],
          ],
        },
      };
    return (
        <>
        <ReactQuill
          style={{ width: "800px", height: "600px" }}
          modules={modules}
        />
      </>
    );
}

export default WriteBoard;