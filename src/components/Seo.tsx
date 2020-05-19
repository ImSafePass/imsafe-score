import React from "react";
import { Helmet } from "react-helmet";

import Image from "../assets/og-image.png";

const Seo = () => {
  const title = "ImSafe Health | Bayes | Better understand your test status.";
  const description = `The accuracy of your test result is a function not only of the test's inherent "sensitivity" and "specificity", but also of your prior likelihood to be positive or negative. Using estimated Covid prevalence in your area as a proxy for prior, this tool aims to help you understand the likelihood that your test result is accurate`;
  const url = window.location.href;
  const image = `${url}${Image.slice(1)}`;

  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      title={title}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: "@ImSafePass",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
        {
          name: `twitter:image`,
          content: image,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: url,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          property: `og:image:width`,
          content: "1200",
        },
        {
          property: `og:image:height`,
          content: "630",
        },
        {
          property: `og:image:alt`,
          content: title,
        },
        {
          property: `og:image:secure_url`,
          content: image.replace("http:", "https:"),
        },
      ]}
    />
  );
};

export default Seo;
