import { useTranslation } from "react-i18next";

function UsePostOptions() {
  const { t } = useTranslation();
  const options = [
    { value: "", label: t("all") },
    { value: "political", label: t("political") },
    { value: "scientific", label: t("scientific") },
    { value: "literary", label: t("literary") },
    { value: "historical", label: t("historical") },
    { value: "philosophical", label: t("philosophical") },
    { value: "personal", label: t("personal") },
    { value: "other", label: t("other") },
  ];
  return { options };
}

export default UsePostOptions;
