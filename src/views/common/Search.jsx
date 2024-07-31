const Search = ({search, setSearch}) => {
    return (
        <>
        <div className='form-group'>
            <input type='search' value={search} onChange={(e)=>{setSearch(e.target.value)}} className='form-control form-control-sm' placeholder='Search...' />
          </div>
        </>
    );
}

export default Search;