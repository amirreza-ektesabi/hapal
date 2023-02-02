export function getDefaultStaticProps(paramName) {
  return function ({ params }) {
    return {
      props: {
        [paramName]: params[paramName],
      },
    };
  };
}

export function getDefaultStaticPaths({}) {
  return {
    paths: [],
    fallback: "blocking",
  };
}
