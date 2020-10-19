export namespace QueryUtils {
  export function getParams(): URLSearchParams {
    return new URLSearchParams(location.href.split('?')[1]);
  }
}
