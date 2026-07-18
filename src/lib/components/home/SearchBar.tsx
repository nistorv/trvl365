import { useState } from "react";
import type React from "react";
import { Button } from "../Button";

export interface SearchBarProps {
  submitSearch: (query: string) => void;
  value?: string;
  loading?: boolean;
}

export function SearchBar(props: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(props.value);

  const submitSearchQuery = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.submitSearch(searchQuery!);
  }

  return (
    <form onSubmit={submitSearchQuery} className="flex gap-2">
      <input
        placeholder="Search for blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={props.loading}
        className="flex-1 px-4 py-2.5 border border-(--border) bg-(--bg) text-(--text-h) outline-none disabled:opacity-60"
      />
      <Button
        buttonStyleType="submit"
        disabled={props.loading}
        className="px-5! py-2.5! text-base! min-w-27.5"
      >
        {props.loading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}