import React from "react";
import { motion } from "framer-motion";
import UsePostDetails from "../hooks/use-post-details";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useTranslation } from "react-i18next";
import "./Details.css";
const Details = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { loading, error, post } = UsePostDetails(id);
  const days = [
    t("Sunday"),
    t("Monday"),
    t("Tuesday"),
    t("Wednesday"),
    t("Thursday"),
    t("Friday"),
    t("Saturday"),
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return formattedDate.toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: "0.3" }}
    >
      <Loading loading={loading} error={error}>
        <div className="container mb-1">
          <div className="title mb-1">
            <h1>
              {post?.title &&
                post.title
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
            </h1>
            <span>({t(post?.post_type?.label)})</span>
          </div>
          {post?.img && (
            <img src={post.img} alt={post?.title} className="img-style mb-3" />
          )}
          <div className="description">
            <div className="description-txt pb-1">
              <p>{post?.description}</p>
            </div>
            {post?.date && (
              <div className="date-posted mt-3 mb-5">
                {t("date")} : {days[new Date(post.date).getDay()]}
                {"   "}
                {formatDate(post.date)}
              </div>
            )}
          </div>
        </div>
      </Loading>
    </motion.div>
  );
};

export default Details;
