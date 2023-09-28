import React, { Fragment, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, ButtonGroup, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, fetchPosts } from "../RTK/Slices/PostSlice";
import swal from "sweetalert";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import withGuard from "../util/withGuard";
import { useTranslation } from "react-i18next";
import "./PostList.css";
import { ReactComponent as Next } from "../assets/chevron-right.svg";
import { ReactComponent as Prev } from "../assets/chevron-left.svg";
import { ReactComponent as Last } from "../assets/chevrons-right.svg";
import { ReactComponent as First } from "../assets/chevrons-left.svg";
import UsePostOptions from "../hooks/use-post-options";
import Select from "react-select";

const PostList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { options } = UsePostOptions();
  const [filter, setFilter] = useState(
    localStorage.getItem("value") || options[0].value
  );
  const [pageNo, setPageNo] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const { records, loading, error, count } = useSelector(
    (state) => state.posts
  );
  const No_of_pages = Math.ceil(count / 5);

  const capitalizeFirstLetter = (str) => {
    return str
      ?.split(" ")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDelete = useCallback(
    (record) => {
      swal({
        title: t("suring"),
        text: t("info"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          dispatch(deletePost(record));
          records?.length === 1 && pageNo !== 1 && setPageNo(pageNo - 1);
          swal(t("deleting_message"), {
            icon: "success",
          });
        } else {
          swal(t("Keeping_post_message"));
        }
      });
    },
    [dispatch, records.length]
  );

  useEffect(() => {
    dispatch(fetchPosts({ pageNo, type: filter }));
  }, [dispatch, pageNo, records.length, filter]);

  useEffect(() => {
    localStorage.setItem("currentPage", pageNo.toString());
  }, [pageNo]);

  let post_num = 0;
  const data =
    records &&
    records.map((record) => (
      <tr key={record.id} style={{ height: "16vh" }}>
        <td className="body-color center-content">{++post_num}</td>
        <td className="center-content text-center">
          <Link
            to={`post/${record.id}`}
            title={t("details")}
            style={{ fontSize: "16px" }}
          >
            {capitalizeFirstLetter(record?.title)?.substring(0, 10)}
          </Link>
        </td>
        <td className="body-color">
          <div className="image">
            {" "}
            <img
              src={record.img}
              alt={`img for ${record?.title?.substring(0, 10)}`}
            />
          </div>
        </td>
        <td className="center-content text-center">
          <ButtonGroup aria-label="Basic example">
            <Link to={`post/${record.id}/edit`}>
              <Button variant="success">{t("edit")}</Button>
            </Link>
            <Button variant="danger" onClick={() => handleDelete(record)}>
              {t("delete")}
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    ));

  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: "0.3" }}
      exit={{ y: "-100vh" }}
    >
      <Container>
        <div className="select">
          <Select
            className="select-black"
            options={options}
            value={
              localStorage.getItem("value")
                ? {
                    label: t(localStorage.getItem("value")),
                    value: localStorage.getItem("value"),
                  }
                : { value: "", label: t("all") }
            }
            onChange={(val) => {
              setFilter(val.value);
              val.value === ""
                ? localStorage.setItem("value", "")
                : localStorage.setItem("value", val.value);
              setPageNo(1);
            }}
          />
        </div>
        <div style={{ overflowX: "auto", overflowY: "hidden" }}>
          <Table
            bordered
            style={{
              position: "relative",
            }}
          >
            <thead>
              <tr>
                <th className="body-color">#</th>
                <th style={{ width: "10%" }} className="body-color">
                  {t("title")}
                </th>
                <th style={{ width: "40%" }} className="body-color">
                  {t("image")}
                </th>
                <th style={{ width: "30%" }} className="body-color">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              <Loading loading={loading} error={error}>
                {data.length ? data : t("no_data")}
              </Loading>
            </tbody>
          </Table>
        </div>
        {records.length !== 0 && !loading ? (
          <Fragment>
            <div className="count">
              {pageNo} {t("of")} {No_of_pages}
            </div>
            <div className="navigate-btns">
              {" "}
              <Button
                onClick={() => setPageNo(No_of_pages)}
                className="mx-2 navigate-btn"
              >
                {" "}
                <Last />
                <span> {t("last")}</span>
              </Button>{" "}
              <Button
                onClick={() => setPageNo(1)}
                className="mx-2 navigate-btn"
              >
                {" "}
                <First />
                <span> {t("first")}</span>{" "}
              </Button>{" "}
              <Button
                onClick={() => setPageNo(pageNo - 1)}
                disabled={pageNo === 1}
                className="mx-2 navigate-btn"
              >
                {" "}
                <Prev />
                <span> {t("prev")}</span>{" "}
              </Button>{" "}
              <Button
                onClick={() => {
                  setPageNo(pageNo + 1);
                }}
                disabled={No_of_pages === pageNo}
                className="mx-2 navigate-btn"
              >
                <Next />
                <span> {t("next")}</span>
              </Button>
            </div>
          </Fragment>
        ) : null}{" "}
      </Container>{" "}
    </motion.div>
  );
};

export default withGuard(PostList);
