import { Button } from "../Button";

interface PaginationProps {
  page: number;
  pageCount: number;
  loading: boolean;
  switchPage: (page: number) => void;
}

export function Pagination(props: PaginationProps) {
  if (props.pageCount <= 1) {
      return null;
  }

  return (
    <div className="shrink-0 flex items-center justify-center gap-2 px-[5%] py-3 border-t border-(--border) bg-(--bg)">
      <Button
          onClick={() => props.switchPage(1)}
          disabled={props.loading || props.page === 1}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30">
        {"<<"}
      </Button>
      <Button
          onClick={() => props.switchPage(props.page - 1)}
          disabled={props.loading || props.page === 1}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30">
        {"<"}
      </Button>
      <span className="px-3 text-sm text-(--text)">
        {props.page} / {props.pageCount}
      </span>
      <Button
          onClick={() => props.switchPage(props.page + 1)}
          disabled={props.loading || props.page === props.pageCount}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30">
        {">"}
      </Button>
      <Button
          onClick={() => props.switchPage(props.pageCount)}
          disabled={props.loading || props.page === props.pageCount}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30">
        {">>"}
      </Button>
    </div>
  );
}