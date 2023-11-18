import React from "react";

const Img = ({ url, caption }) => {
  return (
    <div>
      <img
        className="w-full text-centre my-3 rounded-lg md:mb-12 text-base text-dark-white"
        src={url}
        alt="image"
      />
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-white">
          {caption}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <>
      <div className="bg-purple/20 rounded border-l-8  p-3 bl-5 border-purple">
        <p className="text-xl leading-10 md:text-2xl   font-Inter">{quote}</p>
        {caption.length ? (
          <p className="w-full text-base font-Poppins text-purple">{caption}</p>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const List = ({ style, items }) => {
  return (
    <div className="ml-6">
      <ol
        className={
          `ml-[25px] ${style == "ordered"}` ? "list-decimal" : "list-disc"
        }
      >
        {items.map((listitem, i) => (
          <li
            key={i}
            className="my-4 font-Poppins"
            dangerouslySetInnerHTML={{ __html: listitem }}
          ></li>
        ))}
      </ol>
    </div>
  );
};

const BlogContent = ({ block }) => {
  let { type, data } = block;
  if (type == "paragraph") {
    return (
      <p
        className="font-Poppins font-normal text-[16px]"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></p>
    );
  }
  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          className="text-3xl font-semibold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }
    return (
      <h2
        className="text-4xl font-semibold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  // Move this block outside of the "if (type == 'header')" block
  if (type == "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type == "list") {
    return <List style={data.style} items={data.items} />;
  }
};

export default BlogContent;
