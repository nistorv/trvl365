import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RiSortAsc,
    RiSortDesc,
    RiSortAlphabetAsc,
    RiSortAlphabetDesc,
    RiSortNumberAsc,
    RiSortNumberDesc,
    RiFilterLine,
    RiFilterFill,
} from "react-icons/ri";
import { getCategories, getCities } from "../../blogs";
import { CheckboxField } from "../CheckboxField";
import { Modal } from "../Modal";
import { Button } from "../Button";

const sortOptions = [
  { value: 'CREATED_DESC', label: 'Newest to Oldest', Icon: RiSortDesc },
  { value: 'CREATED_ASC', label: 'Oldest to Newest', Icon: RiSortAsc },
  { value: 'ALPHABETICAL_ASC', label: 'A-Z', Icon: RiSortAlphabetAsc },
  { value: 'ALPHABETICAL_DESC', label: 'Z-A', Icon: RiSortAlphabetDesc },
  { value: 'REACTIONS_ASC', label: 'Fewest to Most Reactions', Icon: RiSortNumberAsc },
  { value: 'REACTIONS_DESC', label: 'Most to Fewest Reactions', Icon: RiSortNumberDesc },
];

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = getCategories();
  const cities = getCities();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [minReactions, setMinReactions] = useState<string>('');

  function openFilterModal() {
    setSelectedCategories(searchParams.getAll('categories'));
    setSelectedCities(searchParams.getAll('cities'));
    setMinReactions(searchParams.get('numReactions') ?? '');
    setFilterModalOpen(true);
  }

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', filterModalOpen || sortModalOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    }
  }, [filterModalOpen, sortModalOpen]);

  const activeFilter = searchParams.getAll('categories').length > 0
    || searchParams.getAll('cities').length > 0
    || searchParams.has('numReactions');

  const currentSort = searchParams.get('sortBy') ?? 'CREATED_DESC';
  const isSorted = currentSort !== 'CREATED_DESC';


  function clearSearchParams(url: URLSearchParams) {
    url.delete('categories');
    url.delete('cities');
    url.delete('numReactions');
    url.delete('page');
  }

  function applyFilter() {
    const filterUrl = new URLSearchParams(searchParams);
    clearSearchParams(filterUrl);

    selectedCategories.forEach((category) => filterUrl.append('categories', category));
    selectedCities.forEach((city) => filterUrl.append('cities', city));

    if (minReactions !== '' && Number(minReactions) > 0) {
      filterUrl.set('numReactions', minReactions);
    }

    setSearchParams(filterUrl);
    setFilterModalOpen(false);
  }

  function clearFilter() {
    const filterUrl = new URLSearchParams(searchParams);
    clearSearchParams(filterUrl);
    setSearchParams(filterUrl);

    setSelectedCategories([]);
    setSelectedCities([]);
    setMinReactions('');

    setFilterModalOpen(false);
  }

  function selectSort(sort: string) {
    const sortURL = new URLSearchParams(searchParams);

    if (sort === 'CREATED_DESC') {
      sortURL.delete('sortBy');
    } else {
      sortURL.set('sortBy', sort);
    }
    sortURL.delete('page');
    setSearchParams(sortURL);
    setSortModalOpen(false);
  }

  const {Icon: SortIcon} = sortOptions.find((o) => o.value === currentSort) ?? sortOptions[0];

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSortModalOpen(true)}
          className={`flex items-center gap-1 cursor-pointer ${isSorted ? 'text-(--accent)' : 'text-(--text) hover:text-(--text-h)'}`}
        >
          <SortIcon className="w-6 h-6"/>
        </button>

        <button
          onClick={openFilterModal}
          className={`flex items-center gap-1 cursor-pointer ${activeFilter ? 'text-(--accent)' : 'text-(--text) hover:text-(--text-h)'}`}
        >
          {activeFilter ? <RiFilterFill className="w-6 h-6"/> : <RiFilterLine className="w-6 h-6"/>}
        </button>
      </div>

      {sortModalOpen && (
        <Modal title="Sort by" onClose={() => setSortModalOpen(false)}>
          <div className="flex flex-col gap-1">
            {sortOptions.map(({value, label, Icon}) => (
              <button
                key={value}
                onClick={() => selectSort(value)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm border cursor-pointer ${
                  currentSort === value
                    ? 'bg-(--accent) border-(--accent) text-white'
                    : 'bg-(--bg) border-(--border) text-(--text) hover:border-(--accent)'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0"/>
                {label}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {filterModalOpen && (
        <Modal title="Filters" onClose={() => setFilterModalOpen(false)}>
          <div className='flex flex-col gap-1'>
            <label className="text-sm font-medium text-(--text-h)">
              Categories
            </label>
            <CheckboxField
              items={categories}
              selected={selectedCategories}
              select={setSelectedCategories}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className="text-sm font-medium text-(--text-h)">
              Cities
            </label>
            <CheckboxField
              items={cities}
              selected={selectedCities}
              select={setSelectedCities}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className="text-sm font-medium text-(--text-h)">
              Minimum Reactions
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minReactions}
              onChange={(e) => setMinReactions(e.target.value)}
              className="w-2/5 px-3 py-1.5 text-sm border border-(--border) bg-(--bg) text-(--text-h) outline-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={clearFilter}>
              Clear
            </Button>
            <Button buttonStyleType="submit" onClick={applyFilter} className="flex-1">
              Apply
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}