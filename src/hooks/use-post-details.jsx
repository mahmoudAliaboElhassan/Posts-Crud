import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../RTK/Slices/PostSlice";

const UsePostDetails = (id) => {
  const dispatch = useDispatch();
  const { loading, error, post } = useSelector((state) => state.posts);
  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);
  return { loading, error, post };
};

export default UsePostDetails;
