import { useSelector, useDispatch } from "react-redux";
import { handleContentWidth } from "@/store/layoutReducer";

const useContentWidth = () => {
  const dispatch = useDispatch();
  const contentWidth = useSelector((state) => state.layout.contentWidth);

  // ** Toggles Content Width
  const setContentWidth = () => dispatch(handleContentWidth("boxed"));

  return [contentWidth, setContentWidth];
};

export default useContentWidth;
