import useSWR from "swr";

export function useSwrNoFocus(key, fetcher) {
  const options = { revalidateOnFocus: false };
  return useSWR(key, fetcher, options);
}
