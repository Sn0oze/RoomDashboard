export namespace QueryUtils {
  export function getParams(): URLSearchParams {
    return new URLSearchParams(location.search);
  }
}
